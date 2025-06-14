import { useLocation, useParams } from "react-router-dom";
import AssetSelector from "../../components/plugins/AssetSelector";
import { TokenData } from "../../constants/types/tokenData";
import { useEffect, useMemo, useState } from "react";
import useTokenData from "../../hooks/read/useTokenData";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import ConnectPrompt from "../../components/shared/ConnectPrompt";
import LoadingState from "../../components/shared/LoadingState";
import useDepositCollateral from "../../hooks/write/useDepositCollateral";
import useWithdrawCollateral from "../../hooks/write/useWithdrawCollateral";
import { toast } from "sonner";
import useWithdrawPool from "../../hooks/write/useWithdrawPool";

const Transact = () => {
	const { id } = useParams();
	const location = useLocation();
	const state = useMemo(() => location.state || {}, [location.state]);

	const { tokenData, tokenDataLoading } = useTokenData();
	const { address, isConnected, chainId } = useWeb3ModalAccount();


	const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
	const [assetValue, setAssetValue] = useState("");

	const [availableBal, setAvailableBal] = useState(state?.available || 0);

	useEffect(() => {
		if (tokenData && tokenData.length > 0) {
			const tokenMatch = tokenData.find(
				(t) => t.symbol.toLowerCase() === state?.tokenType?.toLowerCase()
			);
			setSelectedToken(tokenMatch || tokenData[0]);
		}
	}, [tokenData, state?.tokenType]);

	useEffect(() => {
		setAvailableBal(state?.available);
	}, [state?.available]);

	const handleTokenSelect = (token: TokenData) => {
		setSelectedToken(token);
	};

	const handleAssetValueChange = (value: string) => {
		setAssetValue(value);
	};

	const withdrawalCollateral = useWithdrawCollateral(
		selectedToken?.address || "",
		assetValue,
		selectedToken?.decimals || 18,
		selectedToken?.name || ""
	);

	const withdrawalPool = useWithdrawPool(
		selectedToken?.address || "",
		assetValue,
		selectedToken?.decimals || 18,
		selectedToken?.name || ""
	);

	const deposit = useDepositCollateral(
		selectedToken?.address || "",
		assetValue,
		selectedToken?.decimals || 18,
		selectedToken?.name || ""
	);

	const handleWithdraw = () => {
		if (!selectedToken) {
			toast.error("No token selected");
			return;
		}
		if (!assetValue) {
			toast.error("Please enter an amount");
			return;
		}

		// Conditional withdrawal based on state.type
		if (state?.type === "supply") {
			withdrawalPool();
		} else if (state?.type === "collateral") {
			withdrawalCollateral();
		} else {
			toast.error("Invalid withdrawal type");
		}
	};

	const handleDepositCollateral = () => {
		if (!selectedToken) {
			toast.error("No token selected");
			return;
		}
		if (!assetValue) {
			toast.error("Please enter an amount");
			return;
		}

		// console.log(selectedToken, assetValue);

		deposit();
	};

	if ((tokenDataLoading)) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<LoadingState />
			</div>
		);
	}

	if (!!address && !isConnected) {
		return (
			<div className="font-kaleko py-6 h-screen">
				<div className="w-full m-auto">
					<h3 className="text-lg text-white px-2 mb-2">
						{id == "lend" ? "Create Lend Order" : "Create Borrow Order"}
					</h3>
					<ConnectPrompt />
				</div>
			</div>
		);
	}

	if (!tokenData || tokenData.length === 0) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<LoadingState />
				<div className="mt-6">Error: Refetching available tokens...</div>
			</div>)
	}

	return (
		<div className="min-h-screen flex items-center lg:items-start justify-center  p-4 lg:pt-36 lg:px-4">
			<div className="max-w-[593px] w-full bg-[#050505] rounded-xl p-4 noise-no-overflow">
				<div className="max-w-[450px] mx-auto">
					<p className="text-2xl text-white px-2 font-bold flex items-start capitalize">
						{id}
					</p>

					<div className="">
						<div className="px-4 sm:px-8 my-4">
							<div className="flex flex-col items-start w-full">
								<p className="font-semibold mb-1 text-white">Select Asset</p>
								<div className="w-full">
									{selectedToken && (
										<AssetSelector
											onTokenSelect={handleTokenSelect}
											onAssetValueChange={handleAssetValueChange}
											assetValue={assetValue}
											userAddress={address}
											actionType={id === "withdraw" ? "withdraw" : "deposit"}
											tokenData={tokenData}
											selectedToken={selectedToken}
											availableBal={availableBal}
											chainId = {chainId}
										/>
									)}
								</div>
							</div>
						</div>

						<div className="px-6 sm:px-10">
							{id === "deposit" && (
								<button
									className={`w-full rounded-md px-6 py-2 text-center cursor-pointer bg-[#FF4D00CC] text-black font-semibold tracking-widest`}
									onClick={handleDepositCollateral}
								>
									Deposit Collateral
								</button>
							)}

							{id === "withdraw" && (
								<div
									className={`w-full rounded-md px-6 py-2 text-center cursor-pointer bg-[#FF4D00CC] text-black font-semibold tracking-widest`}
									onClick={handleWithdraw}
								>
									{state?.type === "supply"
										? "Withdraw from Pool"
										: "Withdraw Collateral"}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Transact;
