import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";
import { formatMoney } from "../../constants/utils/formatMoney.ts";
import { getTokenLogo } from "../../constants/utils/getTokenLogo.ts";
import { useNavigate } from "react-router-dom";


interface LiquidityBorrowsTableProps {
    borrowFromLP: {
        asset: string;
        amount: number;
        value: number;
        apr: number;
    }[];
}

const LiquidityBorrowsTable: React.FC<LiquidityBorrowsTableProps> = ({ borrowFromLP }) => {
    const navigate = useNavigate();

    const handleBorrow = (asset: string) => {
        navigate("/supply-borrow", {
            state: {
                mode: "borrow",
                tokenType: asset
            }
        })
    };

    // Filter out assets with zero amount
    const filteredBorrows = borrowFromLP.filter(asset => asset.amount > 0);

    return (
        <div className="w-full">
            <div className="grid grid-cols-6 gap-4 p-4 bg-[#181919] rounded-t-md font-semibold text-sm text-left text-white noise shadow-1">
                <span>Assets</span>
                <span>Amount</span>
                <span>APR</span>
                <span>Value</span>
                <span>Accrued Interest</span>
                <span>Actions</span>
            </div>

            <div className="bg-[#050505] rounded-b-md p-4 overflow-x-scroll noise shadow-1">
                {filteredBorrows.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">
                        No active borrows from liquidity pools
                    </div>
                ) : (
                    filteredBorrows.map((borrow, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-6 gap-4 py-3 text-sm items-center text-left border-b border-gray-800 last:border-b-0"
                        >
                            <TokenTagSm 
                                icon={getTokenLogo(borrow.asset)} 
                                symbol={borrow.asset} 
                            />

                            <div className="flex flex-col">
                                <span className="font-bold">
                                    {formatMoney(borrow.amount)}
                                </span>
                            </div>

                            <div className="font-semibold">
                                {(borrow.apr * 100).toFixed(2)}%
                            </div>

                            <div className="text-white">
                                ${formatMoney(borrow.value)}
                            </div>

                            <div className="text-white">
                                {/* Calculate daily interest based on APR */}
                                ${formatMoney((borrow.value * borrow.apr) / 365)}
                            </div>

                            <div className="flex gap-2 justify-start">
                                <CustomBtn1
                                    label="Borrow"
                                    variant="primary"
                                    onClick={() => handleBorrow(borrow.asset)}
                                />
                                <CustomBtn1 label="Repay" variant="secondary" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LiquidityBorrowsTable;