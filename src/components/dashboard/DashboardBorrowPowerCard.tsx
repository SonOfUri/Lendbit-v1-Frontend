import React from "react";
import PercentageTag from "../plugins/PercentageTag";
import MeterGauge from "../plugins/MeterGauge";

type DashboardBorrowPowerPropsCard = {
  available: number;
  totalCollateral: number;
};

const DashboardBorrowPowerCard: React.FC<DashboardBorrowPowerPropsCard> = ({
  available,
  totalCollateral,
}) => {
  const borrowLimit = 0.8 * totalCollateral;
  const percentage = borrowLimit === 0
    ? 0
    : Math.floor(Math.min((available / borrowLimit) * 100, 100));

  return (
    <div className="flex items-center justify-between w-full p-4 bg-black rounded-md text-white noise shadow-1 ">
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