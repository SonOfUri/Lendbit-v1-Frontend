import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useCallback } from "react";
import { isSupportedChain } from "../../constants/utils/chains";
import { toast } from "sonner";
import { getProvider } from "../../api/provider";
import {
  getERC20Contract, getLendbitContract,
} from "../../api/contractsInstance";
import lendbit from "../../abi/LendBit.json";
import erc20 from "../../abi/erc20.json";
import { MaxUint256 } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { envVars } from "../../constants/config/envVars";
import { useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";

const useServiceRequest = (

) => {
  const { chainId, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const queryClient = useQueryClient();

  const errorDecoder = ErrorDecoder.create([lendbit, erc20]);

  // console.log("_amount", _amount, "_requestId,", _requestId, "tokenTypeAddress", tokenTypeAddress);


  return useCallback(async (
    _amount: string,
    _requestId: number,
    tokenTypeAddress: string
  ) => {
    if (!isSupportedChain(chainId)) return toast.warning("SWITCH NETWORK");


    const readWriteProvider = getProvider(walletProvider as Eip1193Provider);
    const signer = await readWriteProvider.getSigner();
    const contract = getLendbitContract(signer, lendbit);
    const erc20contract = getERC20Contract(signer, tokenTypeAddress);

    const allowance = await erc20contract.allowance(address, envVars.lendbitContractAddress);
    const allowanceVal = Number(allowance);

    let toastId: string | number | undefined;

    try {
      toastId = toast.loading(`Processing... Servicing request...`);

      if (allowanceVal == 0 || allowanceVal < Number(_amount)) {
        const allowance = await erc20contract.approve(
          envVars.lendbitContractAddress,
          MaxUint256
        );
        const allowanceReceipt = await allowance.wait();

        if (!allowanceReceipt.status)
          return toast.error("Approval failed!", { id: toastId });
      }

      const transaction = await contract.serviceRequest(
        _requestId,
        tokenTypeAddress
      );
      const receipt = await transaction.wait();

      if (receipt.status) {
        toast.success(`request ${_requestId} successfully serviced!`, {
          id: toastId,
        });

        queryClient.invalidateQueries({ queryKey: ["dashboard", address] });
        queryClient.invalidateQueries({ queryKey: ["market"] });
        queryClient.invalidateQueries({ queryKey: ["position"] });

      }
    } catch (error: unknown) {
      try {
        const decodedError = await errorDecoder.decode(error);
        console.error("Transaction failed:", decodedError.reason);
        toast.error(`Transaction failed: ${decodedError.reason}`, { id: toastId });
      } catch (decodeError) {
        console.error("Error decoding failed:", decodeError);
        toast.error("Transaction failed: Unknown error", { id: toastId });
      }
    }
  }, [chainId, walletProvider, address, queryClient, errorDecoder]);
};

export default useServiceRequest;