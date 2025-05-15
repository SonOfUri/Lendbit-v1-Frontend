import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";
import { useWeb3Modal } from "@web3modal/ethers/react";

const DashboardPortfolioTable = () => {
	const data = [
		{
			icon: "/Token-Logos/usdc-base.svg",
			symbol: "USDC",
			amount: "9.1K",
			usd: "$9.1k",
			apy: "0.00%",
			status: "Collateral",
		},
		{
			icon: "/Token-Logos/usdt-base.svg",
			symbol: "USDT",
			amount: "9.1K",
			usd: "$9.1k",
			apy: "5.31%",
			status: "Not Collateral",
		},
		{
			icon: "/Token-Logos/weth-base.svg",
			symbol: "WETH",
			amount: "12",
			usd: "$21.5k",
			apy: "0.00%",
			status: "Collateral",
		},
		{
			icon: "/Token-Logos/eth-base.svg",
			symbol: "ETH",
			amount: "3",
			usd: "$5.3k",
			apy: "4.57%",
			status: "Not Collateral",
		},
	];

	const toggleCollateral = (symbol: string) => {
		const index = data.findIndex((item) => item.symbol === symbol);
		if (index !== -1) {
			data[index].status =
				data[index].status === "Collateral" ? "Not Collateral" : "Collateral";
		}
    };
    
    const { open } = useWeb3Modal();
    const walletConnect = () => {
    open();
    };

	return (
		<div className="text-white w-full h-full ">
			<div className="flex justify-between items-center mb-2 px-2">
				<h2 className="text-xl font-bold">My Portfolio</h2>
			</div>

			<div className="noise shadow-1 rounded-md">
				<div className="text-sm text-gray-300 flex justify-between p-4 rounded-t-md bg-[#050505] noise shadow-1 ">
					<div className="text-sm text-gray-400 mb-2">
						Total Balance:{" "}
						<span className="font-semibold text-white">$0.00</span>
					</div>
					<div className="text-sm text-gray-400 mb-2">
						{" "}
						Max Withdrawal:{" "}
						<span className="font-semibold text-white"> $0.00</span>
					</div>
				</div>

				<div className="border-t border-gray-700 p-4 bg-[#050505] rounded-b-md overflow-x-auto overflow-y-hidden max-h-[300px] relative">
                    <div className="absolute inset-0 bg-[#87878720] bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                        <img onClick={walletConnect} src="/connect.svg" alt="Connect Icon" className="w-20 h-20 cursor-pointer" />
                    </div>

					{/* Table Header */}
					<div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.5fr] gap-4 py-2 font-semibold text-sm text-left">
						<span>Assets</span>
						<span>Deposit</span>
						<span>APY</span>
						<span>Collateral</span>
						<span>Actions</span>
					</div>

					{/* Table Rows */}
					{data.map(({ icon, symbol, amount, usd, apy, status }) => (
						<div
							key={symbol}
							className="grid grid-cols-[1fr_1fr_1fr_1fr_1.5fr] gap-4 py-3 items-center text-left"
						>
							<TokenTagSm icon={icon} symbol={symbol} />

							<div className="flex flex-col">
								<span className="font-bold text-sm">{amount}</span>
								<span className="text-xs text-gray-400">{usd}</span>
							</div>

							<div className="font-semibold text-sm">{apy}</div>

							<button onClick={() => toggleCollateral(symbol)}>
								<img
									src={
										status === "Collateral"
											? "/toggle-on.svg"
											: "/toggle-off.svg"
									}
									alt="Toggle"
									width={28}
									height={28}
								/>
							</button>

							<div className="flex gap-2 justify-start">
								<CustomBtn1 label="Withdraw" variant="secondary" />
								<CustomBtn1
									label={status === "Collateral" ? "Deposit" : "Supply"}
									variant="primary"
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default DashboardPortfolioTable;
