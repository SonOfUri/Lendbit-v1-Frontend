import { useState } from "react";
import LiquidityBorrowsTable from "./LiquidityBorrowsTable.tsx";
import P2PBorrowOrdersTable from "./P2PBorrowOrdersTable.tsx";

interface BorrowAsset {
    asset: string;
    amount: number;
    value: number;
    apr: number;
}

interface BorrowOrder {
    asset: string;
    amount: number;
    apr: number;
    duration: number;
    dueDate: string;
    orderId: string;
}

interface BorrowsProps {
    borrowFromLP?: BorrowAsset[];
    borrowOrders?: BorrowOrder[];
}

const Borrows: React.FC<BorrowsProps> = ({ borrowFromLP = [], borrowOrders = [] }) => {
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
                <LiquidityBorrowsTable borrowFromLP={borrowFromLP} />
            ) : (
                <P2PBorrowOrdersTable borrowOrders={borrowOrders} />
            )}
        </div>
    );
};

export default Borrows;