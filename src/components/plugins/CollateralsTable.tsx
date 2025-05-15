import React from "react";
import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";
import { formatMoney2 } from "../../constants/utils/formatMoney.ts";
import { getTokenLogo } from "../../constants/utils/getTokenLogo.ts";

interface CollateralAsset {
    asset: string;
    amount: number;
    value: number;
    collateralFactor: number;
}

interface CollateralsTableProps {
    collateralAssets?: CollateralAsset[];
}

const CollateralsTable: React.FC<CollateralsTableProps> = ({ collateralAssets = [] }) => {
    // Filter out assets with zero amount/value
    const filteredAssets = collateralAssets.filter(asset => asset.amount > 0 || asset.value > 0);
    
  

    return (
        <div className="w-full text-white bg-[#050505] rounded-md overflow-hidden noise shadow-1">
            {/* Table Header */}
            <div className="grid grid-cols-6 p-4 bg-[#181919] font-semibold text-sm text-left">
                <span>Assets</span>
                <span>Amount</span>
                <span>Value</span>
                <span>Collateral</span>
                <div className="col-span-2 flex justify-start gap-8 pr-2">Actions</div>
            </div>

            {/* Table Body - Show message if no collateral */}
            {filteredAssets.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                    No collateral assets deposited
                </div>
            ) : (
                filteredAssets.map((asset) => (
                    <div
                        key={asset.asset}
                        className="grid grid-cols-6 p-4 items-center text-sm text-left border-b border-gray-800 last:border-b-0"
                    >
                        {/* Token */}
                        <TokenTagSm 
                            icon={getTokenLogo(asset.asset)} 
                            symbol={asset.asset} 
                        />

                        {/* Amount */}
                        <div className="flex flex-col">
                            <span className="font-bold">
                                {formatMoney2(asset.amount)}
                            </span>
                        </div>

                        {/* Value */}
                        <div className="flex flex-col">
                            <span className="font-bold">
                                ${formatMoney2(asset.value)}
                            </span>
                        </div>

                        {/* Collateral Factor */}
                        <div className="flex flex-col">
                            <span className="font-bold">
                                {asset.collateralFactor * 100}%
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="col-span-2 flex justify-start gap-4 pr-2">
                            <CustomBtn1 label="Deposit" variant="primary" />
                            <CustomBtn1 label="Withdraw" variant="secondary" />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CollateralsTable;