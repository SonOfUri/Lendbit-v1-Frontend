import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback, useMemo } from "react";
import { isSupportedChains } from "../../constants/utils/chains";
import { toast } from "sonner";
import { getProvider } from "../../api/provider";
import useCheckAllowances from "../read/useCheckAllowances";
import {
    getERC20Contract,
    getLendbitContract,
} from "../../api/contractsInstance";
import lendbit from "../../abi/LendBit.json";
import erc20 from "../../abi/erc20.json";
import { ethers, MaxUint256 } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";
import { formatCustomError } from "../../constants/utils/formatCustomError";
import { CHAIN_CONTRACTS } from "../../constants/config/chains";
import useGetGas from "../read/useGetGas";
import { CCIPMessageType } from "../../constants/config/CCIPMessageType";
  
const useDepositCollateral = (
    tokenTypeAddress: string,
    _amount: string,
    tokenDecimal: number,
    tokenName: string,
) => {
    const { chainId,address} = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const { data: allowanceVal = 0, isLoading } = useCheckAllowances(tokenTypeAddress);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const errorDecoder = ErrorDecoder.create([lendbit, erc20]);

    const _weiAmount = useMemo(() => {
        if (!_amount || isNaN(Number(_amount))) return null;
        try {
          return ethers.parseUnits(_amount, tokenDecimal);
        } catch {
          return null;
        }
      }, [_amount, tokenDecimal]);

    const gasResult = useGetGas({
        messageType: CCIPMessageType.DEPOSIT_COLLATERAL, 
        chainType: chainId === 421614 ? "arb" : "op",
        query: {
          tokenAddress: tokenTypeAddress,
          amount: _weiAmount ? _weiAmount.toString() : "0",
        },
      });

    return useCallback(async () => {
        if (!isSupportedChains(chainId)) return toast.warning("SWITCH NETWORK");
        if (isLoading) return toast.loading("Checking allowance...");



        const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
        const signer = await readWriteProvider.getSigner();
        const erc20contract = getERC20Contract(signer, tokenTypeAddress);
        const contract = getLendbitContract(signer, chainId);

        let toastId: string | number | undefined;

        try {
            toastId = toast.loading(`Checking deposit collateral transaction...`);

            // **Check Allowance and Approve if Needed**
            if (allowanceVal == 0 || allowanceVal < Number(_weiAmount)) {
                if (typeof chainId === 'undefined') {
                    toast.error("Chain ID is undefined - please connect your wallet");
                    return;
                }
            
                toast.loading(`Approving ${tokenName} tokens...`, { id: toastId });
                const allowanceTx = await erc20contract.approve(
                    CHAIN_CONTRACTS[chainId].lendbitAddress, 
                    MaxUint256
                );
                const allowanceReceipt = await allowanceTx.wait();
            
                if (!allowanceReceipt.status) {
                    toast.error("Approval failed!", { id: toastId });
                }
            }    

            // ✅ Wait for gas price if it's still loading
            let finalGasPrice: bigint = 0n;
            while (gasResult.isLoading || !gasResult.data) {
                await new Promise(resolve => setTimeout(resolve, 200)); // Poll every 200ms
            }

            finalGasPrice = BigInt(gasResult?.data?.gasPrice);

            toast.loading(`Processing deposit of ${_amount}${tokenName} as collateral...`, { id: toastId })

            // **Proceed with Deposit**
           
            const transaction = await contract.depositCollateral(tokenTypeAddress, _weiAmount, {
                value: finalGasPrice || 0n,
              });
            const receipt = await transaction.wait();

            if (receipt.status) {
                toast.success(`${_amount}${tokenName} successfully deposited as collateral!`, {
                    id: toastId,
                });
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["dashboard", address] }),
                    queryClient.invalidateQueries({ queryKey: ["market"] }),
                    queryClient.invalidateQueries({ queryKey: ["position", address] }),
                    
                ])

                navigate("/")
            }
        } catch (error: unknown) {
            try {
                const decodedError = await errorDecoder.decode(error);
                let friendlyReason = "error";
                if (decodedError.reason !== null) {
                    friendlyReason = formatCustomError(decodedError.reason);
                }
                console.error("Transaction failed:", decodedError.reason);
                toast.error(`Transaction failed: ${friendlyReason}`, { id: toastId });
            } catch (decodeError) {
                console.error("Error decoding failed:", decodeError);
                toast.error("Transaction failed: Unknown error", { id: toastId });
            }
        }
    }, [chainId, isLoading, walletProvider, tokenTypeAddress, allowanceVal, _weiAmount, gasResult.isLoading, gasResult.data, _amount, tokenName, queryClient, address, navigate, errorDecoder]);
};

export default useDepositCollateral;