import { useEffect, useState } from "react";
import CustomBtn1 from "../plugins/CustomBtn1";
import TokenTagSm from "../plugins/TokenTagSm";
import { formatMoney, formatMoney2 } from "../../constants/utils/formatMoney";
import { useNavigate } from "react-router-dom";

interface Asset {
	asset: string;
	amount: number;
	value: number;
	isCollateral: boolean;
	apy: number | null;
}

interface DashboardPortfolioTableProps {
	portfolio: {
		totalValue: number;
		assets: Asset[];
	};
	maxWithdrawal: {
		total: number;
		assets: {
			asset: string;
			amount: number;
		}[];
	};
}

interface WithdrawState {
	tokenType: string;
	type: "collateral" | "supply";
	available: number;
}

interface DepositState {
	tokenType: string;
}

const DashboardPortfolioTable = ({
	portfolio,
	maxWithdrawal,
}: DashboardPortfolioTableProps) => {
	const navigate = useNavigate();
	const [assets, setAssets] = useState<Asset[]>([]);

	useEffect(() => {
		const filteredAssets = portfolio.assets.filter((asset) => asset.amount > 0);
		setAssets(filteredAssets);
	}, [portfolio.assets]);

	const toggleCollateral = (symbol: string) => {
		setAssets((prev) =>
			prev.map((asset) =>
				asset.asset === symbol
					? { ...asset, isCollateral: !asset.isCollateral }
					: asset
			)
		);
	};

	const handleWithdraw = (asset: Asset) => {
		navigate("/transact/withdraw", {
			state: {
				tokenType: asset.asset,
				type: "collateral",
				available: asset.amount,
			} as WithdrawState,
		});
	};

	const handleDeposit = (asset: string) => {
		navigate("/transact/deposit", {
			state: {
				tokenType: asset,
			} as DepositState,
		});
	};

	const handleSupply = (asset: string) => {
		navigate("/supply-borrow", {
			state: {
				mode: "supply",
				tokenType: asset,
			},
		});
	};

	const getIconPath = (symbol: string) =>
		`/Token-Logos/${symbol.toLowerCase()}-base.svg`;

	return (
		<div className="text-white w-full h-full">
			<div className="flex justify-between items-center mb-2 px-2">
				<h2 className="text-xl font-bold">My Portfolio</h2>
			</div>

			<div className="noise shadow-1 rounded-md">
				<div className="text-sm text-gray-300 flex justify-between p-4 rounded-t-md bg-[#050505] noise">
					<div>
						Total Balance:{" "}
						<span className="font-semibold text-white">
							${formatMoney2(portfolio.totalValue)}
						</span>
					</div>
					<div>
						Max Withdrawal:{" "}
						<span className="font-semibold text-white">
							${formatMoney2(maxWithdrawal.total)}
						</span>
					</div>
				</div>

				<div className="border-t border-gray-700 p-4 bg-[#050505] rounded-b-md overflow-x-auto overflow-y-auto max-h-[300px] h-[260px]">
					<div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.5fr] py-2 font-semibold text-sm text-left">
						<span>Assets</span>
						<span>Deposit</span>
						<span>APY</span>
						<span>Collateral</span>
						<span>Actions</span>
					</div>

					{assets.length > 0 ? (
						assets.map((asset, index) => (
							<div
								key={index}
								className="grid grid-cols-[1fr_1fr_1fr_1fr_1.5fr] gap-4 py-3 items-center text-left"
							>
								<TokenTagSm
									icon={getIconPath(asset.asset)}
									symbol={asset.asset}
								/>

								<div className="flex flex-col">
									<span className="font-bold text-sm">
										{formatMoney(asset.amount)}
									</span>
									<span className="text-xs text-gray-400">
										${formatMoney(asset.value)}
									</span>
								</div>

								<div className="font-semibold text-sm">
									{asset.apy !== null ? `${asset.apy.toFixed(2)}%` : "0.00%"}
								</div>

								<button onClick={() => toggleCollateral(asset.asset)}>
									<img
										src={
											asset.isCollateral ? "/toggle-on.svg" : "/toggle-off.svg"
										}
										alt="Toggle"
										width={28}
										height={28}
									/>
								</button>

								<div className="flex gap-2 justify-start">
									<CustomBtn1
										label="Withdraw"
										variant="secondary"
										onClick={() => handleWithdraw(asset)}
									/>
									<CustomBtn1
										label={asset.isCollateral ? "Deposit" : "Supply"}
										variant="primary"
										onClick={() =>
											asset.isCollateral
												? handleDeposit(asset.asset)
												: handleSupply(asset.asset)
										}
									/>
								</div>
							</div>
						))
					) : (
						<div className="text-gray-400 text-sm text-center py-6">
							No active deposit in portfolio
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default DashboardPortfolioTable;
