/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CustomBtn1 from "../plugins/CustomBtn1";
import TokenTagSm from "../plugins/TokenTagSm";
import { formatDueDate } from "../../constants/utils/formatDate";
import { formatMoney } from "../../constants/utils/formatMoney";

// Type definitions
interface Borrow {
	asset: string;
	amount: number;
	apr: number;
	dueDate?: string;
}

interface Asset {
	asset: string;
	isCollateral: boolean;
	value: number;
}

interface DashboardCardsProps {
	dashboardData: any;
}

interface RowData {
	icon: string;
	symbol: string;
	amount: string;
	usd: string;
	apr: string;
	dueIn: string;
	collateral: string[];
}

// Component
const DashboardBorrowsTable = ({ dashboardData }: DashboardCardsProps) => {
	const [rows, setRows] = useState<RowData[]>([]);

	useEffect(() => {
		const { lending, portfolio } = dashboardData || {};

		const collateralAssets: string[] = portfolio?.assets
			.filter((a: Asset) => a.isCollateral)
			.map((a: Asset) => a.asset);

		const processed: RowData[] = lending?.borrows?.map((borrow: Borrow) => {
			const getIconPath = (symbol: string) =>
				`/Token-Logos/${symbol.toLowerCase()}-base.svg`;

			const icon = getIconPath(borrow?.asset) || "";
			const amount = formatMoney(borrow?.amount);

			const usdVal =
				portfolio.assets.find((a: Asset) => a.asset === borrow?.asset)?.value ||
				0;
			const usd = `$${formatMoney(usdVal)}`;
			const apr = `${borrow.apr.toFixed(2)}%`;

			let dueIn = "-";
			if (borrow.dueDate) {
				dueIn = formatDueDate(borrow.dueDate);
			}

			const collateral = collateralAssets
				.map((c: string) => getIconPath(c))
				.filter(Boolean);

			return {
				icon,
				symbol: borrow.asset,
				amount,
				usd,
				apr,
				dueIn,
				collateral,
			};
		});

		setRows(processed);
	}, [dashboardData]);

	return (
		<div className="text-white w-full h-full">
			<h2 className="text-xl font-bold mb-2 text-left px-2">Borrows</h2>

			<div className="bg-black rounded-md overflow-hidden shadow-1 noise">
				<div className="grid grid-cols-6 gap-4 py-3 px-4 font-semibold text-sm text-left">
					<span>Assets</span>
					<span>Borrow</span>
					<span>APR</span>
					<span>Collateral</span>
					<span>Due In</span>
					<span>Action</span>
				</div>

				<div className="overflow-y-auto max-h-[310px]">
					{rows?.map(
						({ icon, symbol, amount, usd, apr, collateral, dueIn }, i) => (
							<div
								key={i}
								className="grid grid-cols-6 gap-4 py-3 px-4 items-center text-left"
							>
								<TokenTagSm icon={icon} symbol={symbol} />

								<div className="flex flex-col">
									<span className="font-bold text-sm">{amount}</span>
									<span className="text-xs text-gray-400">{usd}</span>
								</div>

								<div className="font-semibold text-sm">{apr}</div>

								<div className="flex -space-x-2">
									{collateral?.map((src: string, j: number) => (
										<img
											key={j}
											src={src}
											alt={`collateral-${j}`}
											width={20}
											height={20}
											className="rounded-full"
											style={{ marginLeft: j === 0 ? "0" : "-6px" }}
										/>
									))}
								</div>

								<div className="text-sm text-gray-300">{dueIn}</div>

								<div className="flex justify-start">
									<CustomBtn1 label="Repay" variant="secondary" />
								</div>
							</div>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default DashboardBorrowsTable;
