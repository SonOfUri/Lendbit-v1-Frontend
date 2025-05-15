import React from "react";
import DashboardBorrowPowerCard from "./DashboardBorrowPowerCard.tsx";

type PositionsBorrowPowerCardProps = {
	percentage: number;
	totalCollateral: string;
	availableToBorrow: string;
};

const PositionsBorrowPowerCard: React.FC<PositionsBorrowPowerCardProps> = ({
	percentage,
	totalCollateral,
	availableToBorrow,
}) => {
	return (
		<div className="rounded-md bg-[#050505] text-white  w-full noise shadow-1">
			{/* Top summary section */}
			<div className="flex justify-between text-sm p-4 rounded-t-md font-light px-2 bg-[#181919]">
				<p>
					Total Collateral:{" "}
					<span className="font-semibold">{totalCollateral}</span>
				</p>
				<p>
					Available to Borrow:{" "}
					<span className="font-semibold">{availableToBorrow}</span>
				</p>
			</div>

			{/* Core Borrow Power chart */}
			<DashboardBorrowPowerCard percentage={percentage} />
		</div>
	);
};

export default PositionsBorrowPowerCard;
