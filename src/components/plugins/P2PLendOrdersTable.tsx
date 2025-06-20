import { useState, useEffect, useRef } from "react";
import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";
import { formatMoney } from "../../constants/utils/formatMoney.ts";
import { getTokenLogo } from "../../constants/utils/getTokenLogo.ts";
import useCloseListingAd from "../../hooks/write/useCloseListingAd.ts";

interface P2PLendOrdersTableProps {
    lendOrders: {
        asset: string;
        amount: number;
        apr: number;
        duration: number;
        orderId: string;
    }[];
}

const P2PLendOrdersTable: React.FC<P2PLendOrdersTableProps> = ({ lendOrders }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);


    const loanListClose = useCloseListingAd(Number(currentRequestId));

    const handleCloseListing = (orderId: string) => {
        const requestId = Number(orderId);
        setCurrentRequestId(requestId);
        loanListClose(); 
    };

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

    const handleToggle = (orderId: string) => {
        setOpenDropdown((prev) => (prev === orderId ? null : orderId));
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-7 gap-4 font-semibold text-sm text-left text-white bg-[#191818] p-4 rounded-t-md noise shadow-1 sticky top-0 z-10">
                <span>Assets</span>
                <span>Amount</span>
                <span>APR</span>
                <span>Duration</span>
                <span>Order ID</span>
                <span>Status</span>
                <span></span>
            </div>

            <div className="bg-[#050505] p-4 rounded-b-md noise shadow-1">
                {lendOrders.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">
                        No active peer-to-peer lend orders
                    </div>
                ) : (
                    lendOrders.map((order) => (
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

                            <span>{order.duration} days</span>
                            <span className="text-xs">{order.orderId.slice(0, 6)}...{order.orderId.slice(-4)}</span>
                            <span className="text-green-400">Active</span>

                            <div className="hidden xl:block">
                                <CustomBtn1
                                    label="Close"
                                    variant="primary"
                                    onClick={() => handleCloseListing(order.orderId)}
                                />
                            </div>

                            <div 
                                className="relative xl:hidden"
                                ref={(el) => {
                                    if (el) {
                                        dropdownRefs.current[order.orderId] = el;
                                    } else {
                                        delete dropdownRefs.current[order.orderId];
                                    }
                                }}
                            >
                                <button 
                                    onClick={() => handleToggle(order.orderId)}
                                    className="p-1 hover:bg-gray-800 rounded"
                                >
                                    <img
                                        src="/three-dots.svg"
                                        alt="Menu"
                                        width={5}
                                        height={5}
                                        className="cursor-pointer"
                                    />
                                </button>

                                {openDropdown === order.orderId && (
                                    <div className="absolute right-0 -top-6 z-50 bg-[#111] border border-gray-700 rounded-md shadow-lg p-2 w-32 flex flex-col gap-1">
                                        <CustomBtn1 
                                            label="Close" 
                                            variant="primary"
                                            onClick={() => {
                                                handleCloseListing(order.orderId);
                                                setOpenDropdown(null);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default P2PLendOrdersTable;