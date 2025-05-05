// DashboardBorrowPowerCard.tsx
import React from "react";
import MeterGauge from "./MeterGauge";
import PercentageTag from "./PercentageTag";

type DashboardBorrowPowerPropsCard = {
    percentage: number; // e.g. 80
};

const DashboardBorrowPowerCard: React.FC<DashboardBorrowPowerPropsCard> = ({ percentage }) => {
    return (
        <div className="flex items-center justify-between w-full p-4 bg-black rounded-md text-white">
            {/* Left Section */}
            <div className="flex flex-col gap-2 items-center">
                <h3 className="text-2xl font-bold">Borrow Power</h3>
                <PercentageTag percentage={percentage} />
                <p className="text-sm text-white">Borrow Power Left</p>
            </div>

            {/* Right Section */}
            <MeterGauge percentage={percentage} />
        </div>
    );
};

export default DashboardBorrowPowerCard;
