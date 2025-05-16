/* eslint-disable @typescript-eslint/no-explicit-any */
import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";
import { formatMoney } from "../../constants/utils/formatMoney.ts";
import { getTokenLogo } from "../../constants/utils/getTokenLogo.ts";
import { useNavigate } from "react-router-dom";

interface LiquiditySuppliesTableProps {
    supplyToLP: {
        asset: string;
        amount: number;
        value: number;
        apy: number;
    }[];
}


const LiquiditySuppliesTable: React.FC<LiquiditySuppliesTableProps> = ({ supplyToLP }) => {

    const navigate = useNavigate();

    // Filter out assets with zero amount
    const filteredSupplies = supplyToLP.filter(asset => asset.amount > 0);

    const handleSupply = (asset: string) => {
        navigate("/supply-borrow", {
            state: {
                mode: "supply",
                tokenType: asset
            }
        })
    };

    const handleWithdraw = (asset: any ) => {
        // console.log(asset);
        
        navigate("/transact/withdraw", {
            state: {
                tokenType: asset.asset,
                type: "supply",
                available: asset.amount,
            }
        })
    };

  

    return (
        <div className="w-full">
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
                    filteredSupplies.map((asset, index) => (
                        <div
                            key={index}
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
                                {(asset.apy).toFixed(2)}%
                            </div>

                            <div className="text-white">
                                ${formatMoney(asset.value)}
                            </div>

                            <div className="text-white">
                                {/* Calculate daily interest based on APY */}
                                ${formatMoney((asset.value * asset.apy) / 365)}
                            </div>

                            <div className="flex gap-2 justify-start">
                                <CustomBtn1
                                    label="Supply"
                                    variant="primary"
                                    onClick={() => handleSupply(asset.asset)}
                                />
                                <CustomBtn1
                                    label="Withdraw"
                                    variant="secondary"
                                    onClick={() => handleWithdraw(asset)}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LiquiditySuppliesTable;