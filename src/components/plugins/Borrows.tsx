import { useState } from "react";
import LiquidityBorrowsTable from "./LiquidityBorrowsTable.tsx";
import P2PBorrowOrdersTable from "./P2PBorrowOrdersTable.tsx";

const Borrows = () => {
    const [isLPSelected, setIsLPSelected] = useState(true);

    return (
        <div className="text-white w-full">
            <div className="flex justify-end mb-2">
                <div className="flex gap-1 p-1 bg-black rounded-full">
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

            {isLPSelected ? <LiquidityBorrowsTable /> : <P2PBorrowOrdersTable />}
        </div>
    );
};

export default Borrows;
