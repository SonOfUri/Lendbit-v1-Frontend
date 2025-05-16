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
    initialActiveTab?: 'liquidity' | 'p2p';
    id?: string;
}

const Borrows: React.FC<BorrowsProps> = ({id, borrowFromLP = [], borrowOrders = [], initialActiveTab = 'liquidity' }) => {
    const [isLPSelected, setIsLPSelected] = useState(initialActiveTab === 'liquidity');

    // console.log(borrowFromLP, borrowOrders);
    

    return (
        <div id={id} className="text-white w-full">

            <div className="w-full flex items-center justify-between pt-6 pb-4">
                <h2 className="text-xl font-bold text-left w-full">{isLPSelected ? "Borrows" : "My Active Borrow(s)"}</h2>

                <div className="flex justify-end w-full">

                    <div className="flex gap-1 p-1 bg-[#050505] rounded">
                        <button
                            onClick={() => setIsLPSelected(true)}
                            className={`px-4 py-1 rounded text-sm ${isLPSelected  ? "bg-white text-black font-semibold" : "text-white"}`}
                        >
                            Liquidity Pool
                        </button>
                        <button
                            onClick={() => setIsLPSelected(false)}
                            className={`px-4 py-2 rounded ${!isLPSelected ? "bg-white text-black font-semibold" : "text-white"}`}
                        >
                            Peer2Peer
                        </button>
                    </div>
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