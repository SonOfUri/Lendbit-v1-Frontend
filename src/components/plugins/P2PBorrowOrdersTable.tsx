import { useEffect, useRef, useState } from "react";
import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";
import { formatMoney } from "../../constants/utils/formatMoney.ts";
import { formatDate } from "../../constants/utils/formatDate.ts";
import { getTokenLogo } from "../../constants/utils/getTokenLogo.ts";
import useRepayP2P from "../../hooks/write/useRepayLoanP2P.ts";
import { tokenMockedData } from "../../constants/utils/tokenMockedData.ts";

interface P2PBorrowOrdersTableProps {
    borrowOrders: {
        asset: string;
        amount: number;
        apr: number;
        duration: number;
        dueDate: string;
        orderId: string;
    }[];
}

const P2PBorrowOrdersTable: React.FC<P2PBorrowOrdersTableProps> = ({ borrowOrders }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const [selectedRepay, setSelectedRepay] = useState<{
        asset: string;
        amount: string;
        address: string;
        decimals: number;
        requestId: number;
    } | null>(null);
    
    const repayP2P = useRepayP2P(
        selectedRepay?.amount || "0",
        selectedRepay?.requestId || 0,
        selectedRepay?.address || "",
        selectedRepay?.decimals || 18
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdown) {
                const dropdownElement = dropdownRefs.current[openDropdown];
                if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
                    setOpenDropdown(null);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdown]);

    const handleRepay = (asset: string, amount: number, requestId: number) => {
        const tokenInfo = tokenMockedData.find(t => t.symbol === asset);
        setSelectedRepay({
            asset,
            amount: amount.toString(),
            address: tokenInfo?.address || "",
            decimals: tokenInfo?.decimals || 18,
            requestId:requestId,
        });
        // Execute repay after state update
        setTimeout(() => repayP2P(), 0);
    };

    const handleToggle = (orderId: string) => {
        setOpenDropdown((prev) => (prev === orderId ? null : orderId));
    };


    // Calculate days remaining until due date
    const getDaysRemaining = (dueDate: string) => {
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = due.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-7 gap-4 p-4 font-semibold text-sm text-left text-white bg-[#181919] rounded-t-md noise shadow-1">
                <span>Assets</span>
                <span>Amount</span>
                <span>APR</span>
                <span>Due Date</span>
                <span>Order ID</span>
                <span>Status</span>
                <span></span>
            </div>

            <div className="bg-[#050505] rounded-b-md p-4 noise shadow-1">
                {borrowOrders.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">
                        No active peer-to-peer borrow orders
                    </div>
                ) : (
                    borrowOrders.map((order) => {
                        const daysRemaining = getDaysRemaining(order.dueDate);
                        const status = daysRemaining > 0 ? "Active" : "Overdue";
                        
                        return (
                            <div
                                key={order.orderId}
                                className="grid grid-cols-7 gap-4 py-3 text-sm items-center relative text-left border-b border-gray-800 last:border-b-0"
                            >
                                <TokenTagSm 
                                    icon={getTokenLogo(order.asset)} 
                                    symbol={order.asset} 
                                />

                                <div className="flex flex-col">
                                    <span className="font-bold">
                                        {formatMoney(order.amount)}
                                    </span>
                                </div>

                                <div className="font-semibold">
                                    {order.apr.toFixed(2)}%
                                </div>

                                <span>{formatDate(order.dueDate)}</span>
                                <span className="text-xs">{order.orderId.slice(0, 6)}...{order.orderId.slice(-4)}</span>
                                <span className={daysRemaining > 0 ? "text-green-400" : "text-red-400"}>
                                    {status}
                                </span>

                                <div className="hidden xl:block">
                                    <CustomBtn1
                                        label="Repay"
                                        variant="primary"
                                        onClick={() => 
                                            handleRepay(order.asset, order.amount, Number(order.orderId))}
                                    />
                                </div>

                                <div className="relative xl:hidden"
                                    ref={(el) => {
                                    if (el) {
                                        dropdownRefs.current[order.orderId] = el;
                                    } else {
                                        delete dropdownRefs.current[order.orderId];
                                    }
                                }}
                                >
                                    <button onClick={() => handleToggle(order.orderId)}>
                                        <img
                                            src="/three-dots.svg"
                                            alt="Menu"
                                            width={5}
                                            height={5}
                                            className="cursor-pointer"
                                        />
                                    </button>

                                    {openDropdown === order.orderId && (
                                        <div className="absolute -top-6 right-0 bg-[#111] border border-gray-700 rounded-md shadow-md z-10 p-2 w-32 flex flex-col gap-1">
                                            <CustomBtn1
                                                label="Repay"
                                                variant="primary"
                                                onClick={() => {
                                                    handleRepay(order.asset, order.amount, Number(order.orderId));
                                                    setOpenDropdown(null);
                                            }}
                                            />
                                            {/* <CustomBtn1 label="Extend" variant="secondary" /> */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default P2PBorrowOrdersTable;