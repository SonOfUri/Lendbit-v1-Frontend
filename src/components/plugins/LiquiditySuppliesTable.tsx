import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";
import { formatMoney } from "../../constants/utils/formatMoney.ts";
import { getTokenLogo } from "../../constants/utils/getTokenLogo.ts";

interface LiquiditySuppliesTableProps {
    supplyToLP: {
        asset: string;
        amount: number;
        value: number;
        apy: number;
    }[];
}

const LiquiditySuppliesTable: React.FC<LiquiditySuppliesTableProps> = ({ supplyToLP }) => {

    // Filter out assets with zero amount
    const filteredSupplies = supplyToLP.filter(asset => asset.amount > 0);

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-left py-4">Supplies</h2>

            <div className="grid grid-cols-6 gap-4 p-4 bg-[#191818] rounded-t-md font-semibold text-sm text-left text-white noise shadow-1">
                <span>Assets</span>
                <span>Amount</span>
                <span>APY</span>
                <span>Value</span>
                <span>Estimated APY</span>
                <span>Actions</span>
            </div>

            <div className="bg-[#050505] p-4 rounded-b-md overflow-x-scroll noise shadow-1">
                {filteredSupplies.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">
                        No active supplies in liquidity pools
                    </div>
                ) : (
                    filteredSupplies.map((asset) => (
                        <div
                            key={asset.asset}
                            className="grid grid-cols-6 gap-4 py-3 text-sm items-center text-left border-b border-gray-800 last:border-b-0"
                        >
                            <TokenTagSm 
                                icon={getTokenLogo(asset.asset)} 
                                symbol={asset.asset} 
                            />

                            <div className="flex flex-col">
                                <span className="font-bold">
                                    {formatMoney(asset.amount)}
                                </span>
                            </div>

                            <div className="font-semibold">
                                {(asset.apy * 100).toFixed(2)}%
                            </div>

                            <div className="text-white">
                                ${formatMoney(asset.value)}
                            </div>

                            <div className="text-white">
                                {/* Calculate daily interest based on APY */}
                                ${formatMoney((asset.value * asset.apy) / 365)}
                            </div>

                            <div className="flex gap-2 justify-start">
                                <CustomBtn1 label="Supply" variant="primary" />
                                <CustomBtn1 label="Withdraw" variant="secondary" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LiquiditySuppliesTable;