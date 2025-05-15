import { useState } from "react";
import LiquiditySuppliesTable from "./LiquiditySuppliesTable.tsx";
import P2PLendOrdersTable from "./P2PLendOrdersTable.tsx";

interface SupplyAsset {
    asset: string;
    amount: number;
    value: number;
    apy: number;
}

interface LendOrder {
    asset: string;
    amount: number;
    apr: number;
    duration: number;
    orderId: string;
    whitelist: string[];
    min_amount: number;
    max_amount: number;
}

interface SuppliesProps {
    supplyToLP?: SupplyAsset[];
    lendOrders?: LendOrder[];
}

const Supplies: React.FC<SuppliesProps> = ({ supplyToLP = [], lendOrders = [] }) => {
    const [isLPSelected, setIsLPSelected] = useState(true);

    return (
        <div className="text-white w-full">
            <div className="flex justify-end mb-2">
                <div className="flex gap-1 p-1 bg-[#050505] rounded-full">
                    <button
                        onClick={() => setIsLPSelected(true)}
                        className={`px-4 py-1 rounded-full text-sm ${
                            isLPSelected ? "bg-white text-black" : "text-gray-300"
                        }`}
                    >
                        Liquidity Pool
                    </button>
                    <button
                        onClick={() => setIsLPSelected(false)}
                        className={`px-4 py-1 rounded-full text-sm ${
                            !isLPSelected ? "bg-white text-black" : "text-gray-300"
                        }`}
                    >
                        Peer2Peer
                    </button>
                </div>
            </div>

            {isLPSelected ? (
                <LiquiditySuppliesTable supplyToLP={supplyToLP} />
            ) : (
                <P2PLendOrdersTable lendOrders={lendOrders} />
            )}
        </div>
    );
};

export default Supplies;