import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AssetSelector from "../../components/plugins/AssetSelector";
import LoanControl from "../../components/plugins/LoanControl";
import AddRecipients from "../../components/plugins/AddRecipients";
import { DateInputField } from "../../components/CreateOrder/DateInputField";
import useCreateBorrowOrder from "../../hooks/write/useCreateBorrowOrder";
import useDashboardData from "../../hooks/read/useDashboardData";
import useTokenData from "../../hooks/read/useTokenData";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import LoadingState from "../../components/shared/LoadingState";
import ConnectPrompt from "../../components/shared/ConnectPrompt";
import { TokenData } from "../../constants/types/tokenData";
import { toast } from "sonner";

const CreateOrder = () => {

	const { dashboardData, isWalletConnected, dashboardDataLoading } = useDashboardData();
    const { tokenData, tokenDataLoading } = useTokenData();
    const { address, isConnected } = useWeb3ModalAccount();

    const { lending } = dashboardData || {};
	const { availableBorrow = 0 } = lending || {};
	
	const { id } = useParams();
	const navigate = useNavigate();
	const [showLendTooltip, setShowLendTooltip] = useState(false);
	const [showBorrowTooltip, setShowBorrowTooltip] = useState(false);
	const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
	const [assetValue, setAssetValue] = useState("");
	const [rate, setRate] = useState(0); // Default to 5.00%
  	const [orderAmount, setOrderAmount] = useState(0);
	
    const [availableBal, setAvailableBal] = useState(availableBorrow || 0);
    
	const [dateValue, setDateValue] = useState<string>("");
	const [whitelist, setWhitelist] = useState<string[]>([]);
    
    useEffect(() => {
		setAvailableBal(availableBorrow || 0);
	}, [availableBorrow]);

	useEffect(() => {
		if (tokenData && tokenData.length > 0 && !selectedToken) {
		setSelectedToken(tokenData[0]);
		}
	}, [selectedToken, tokenData]);

	useEffect(() => {
		if (assetValue && selectedToken) {
			const amount = parseFloat(assetValue) * selectedToken.price;
			setOrderAmount(amount);
		} else {
			setOrderAmount(0);
		}
	}, [assetValue, selectedToken]);

    const handleTokenSelect = (token: TokenData) => {
		setSelectedToken(token);
	};

	const handleAssetValueChange = (value: string) => {
		setAssetValue(value);
	};


	const unixReturnDate = Math.floor(new Date(dateValue).getTime() / 1000);


    const handleNavigation = () => {
		const missingFields = [];
		
		if (!assetValue) missingFields.push("Amount");
		if (!rate) missingFields.push("Interest");
		if (!dateValue) missingFields.push("Return Date");
		if (!selectedToken?.address) missingFields.push("Token Address");
		if (!selectedToken?.decimals) missingFields.push("Token Decimal");
		if (!selectedToken?.name) missingFields.push("Token Name");

		if (missingFields.length > 0) {
			toast.error(`Missing: ${missingFields.join(", ")}`);
			return;
		}
		if (selectedToken) {
			navigate("/allocation", {
			state: {
				_amount: assetValue,
				_interest: (rate / 10000) || 0,
				_returnDate: unixReturnDate,
				tokenTypeAddress: selectedToken.address,
				tokenDecimal: selectedToken.decimals, 
				tokenName: selectedToken.name,
				tokenSymbol: selectedToken.symbol,
				whiteList: whitelist || [],
				type: id,
			},
			});
		} else {
			toast.error("No token selected");
		}
	};


	const createBorrowOrder = useCreateBorrowOrder(
		assetValue || "0", 
		rate / 10000,
		dateValue ? Math.floor(new Date(dateValue).getTime() / 1000) : 0,
		selectedToken?.address || "", 
		selectedToken?.decimals || 18, 
		selectedToken?.name || ""
	);

	const handleCreateBorrowOrder = () => {
		if (!selectedToken) {
		toast.error("No token selected");
		return;
		}
		if (!assetValue) {
		toast.error("Please enter an amount");
		return;
		}
		if (!dateValue) {
		toast.error("Please select a return date");
		return;
		}
		createBorrowOrder();
	};


	if (dashboardDataLoading || tokenDataLoading) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<LoadingState />
			</div>
		);
	}

    if (!isWalletConnected && !isConnected) {
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

    if (!tokenData || tokenData.length === 0 ) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<LoadingState />
				<div className="mt-6">Error: Refetching available tokens...</div>
			</div>
    )
    }

	return (
		<div className="min-h-screen flex items-center lg:items-start justify-center  p-4 lg:pt-12 lg:px-4">
			<div className="max-w-[593px] w-full bg-[#050505] rounded-xl p-4 noise ">
				<div className="max-w-[450px] mx-auto">
					<p className="text-2xl text-white px-2 font-bold flex items-start">
						Create
					</p>

					<div className="my-4 px-4 sm:px-8 relative">
						<div className="flex w-11/12 overflow-hidden rounded-lg bg-white/20 m-auto">
							<div
								className={`w-1/2 text-center font-bold py-2 text-lg cursor-pointer transition-colors  ${
									id === "lend"
										? "bg-[#FF4D00CC] text-black"
										: "bg-white/10 text-white/50"
								}`}
								onClick={() => navigate("/create/lend")}
								onMouseEnter={() => setShowLendTooltip(true)}
								onMouseLeave={() => setShowLendTooltip(false)}
							>
								Lend Order
								{showLendTooltip && (
									<div className="absolute bottom-full mb-4 ml-2 bg-[#191818] text-white text-xs rounded-lg p-2 w-64 z-10">
										Lenders create lending pools that borrowers can borrow from.
									</div>
								)}
							</div>

							<div
								className={`w-1/2 text-center py-2 text-lg font-semibold cursor-pointer transition-colors ${
									id === "borrow"
										? "bg-[#FF4D00CC] text-black"
										: "bg-white/10 text-white/50"
								}`}
								onClick={() => navigate("/create/borrow")}
								onMouseEnter={() => setShowBorrowTooltip(true)}
								onMouseLeave={() => setShowBorrowTooltip(false)}
							>
								Borrow Order
								{showBorrowTooltip && (
									<div className="absolute bottom-full mb-4 ml-2 bg-[#191818] text-white text-xs rounded-lg p-2 w-64 z-10">
										Borrowers create borrow orders that lenders can service.
									</div>
								)}
							</div>
						</div>
					</div>

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
										actionType={id === "lend" ? "supply" : "borrow"}
										tokenData={tokenData}
										selectedToken={selectedToken}
										availableBal = {availableBal}
									/>
								)}
							</div>
						</div>
					</div>

					<div className="px-4 sm:px-8">
                        <div className="flex flex-col items-start w-full overflow-hidden mx-auto">
                            <div className="w-11/12 mx-auto">
							<p className="font-semibold text-white text-start mb-1">Configure Cost</p>
							{selectedToken && (
								<LoanControl 
									amount={orderAmount} 
									type={id === "lend" ? "APY" : "APR"} 
									tokenSymbol={selectedToken.symbol}
									rate={rate}
									onRateChange={setRate}
								/>
							)}
							</div>
						</div>
                    </div>
                    
                    <div className="px-4 sm:px-8 my-4">
						<div className="flex flex-col items-start w-full overflow-hidden">
                            {id === "lend" &&
                                (
                                <div className="w-full space-y-2">
                                    <DateInputField
                                        dateValue={dateValue}
                                        setDateValue={setDateValue}
                                        text="Due Date"
                                    />
									<AddRecipients
										addresses={whitelist}
        								setAddresses={setWhitelist}
									/>
                                </div>
                                )
                            }
                            {id === "borrow" &&
                                (
                                <div className="w-full">
                                    <DateInputField
                                        dateValue={dateValue}
                                        setDateValue={setDateValue}
                                        text="Expiry Date"
                                    />
                                </div>
                                )
                            }
						</div>
                    </div>
                    
                    <div className="px-6 sm:px-10">
                        {id === "borrow" &&
							<button
								className={`w-full rounded-md px-6 py-2 text-center cursor-pointer bg-[#FF4D00CC] text-black font-semibold tracking-widest`}
								onClick={handleCreateBorrowOrder}
								disabled={!selectedToken || !assetValue || !dateValue}
							>
								Create Order
							</button>
						}

						{id === "lend" &&
							<div
								className={`w-full rounded-md px-6 py-2 text-center cursor-pointer bg-[#FF4D00CC] text-black font-semibold tracking-widest`}
								onClick={handleNavigation}
							>
								Next
							</div>
						}
                    </div>
                    

				</div>
			</div>
		</div>
	);
};

export default CreateOrder;
