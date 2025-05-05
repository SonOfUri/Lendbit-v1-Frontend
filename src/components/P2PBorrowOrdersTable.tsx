import { useState } from "react";
import TokenTagSm from "./TokenTagSm";
import CustomBtn1 from "./CustomBtn1";

const P2PLendOrdersTable = () => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const data = [
        {
            icon: "/Token-Logos/usdc-base.svg",
            symbol: "USDC",
            amount: "9.1K",
            usd: "$9.1k",
            apr: "6.46%",
            pool: "0xer...asj",
            status: "open",
            expiry: "12 Day(s)",
        },
        {
            icon: "/Token-Logos/usdt-base.svg",
            symbol: "USDT",
            amount: "9.1K",
            usd: "$9.1k",
            apr: "5.31%",
            pool: "0xas...12s",
            status: "open",
            expiry: "23 Day(s)",
        },
        {
            icon: "/Token-Logos/weth-base.svg",
            symbol: "WETH",
            amount: "12",
            usd: "$21.5k",
            apr: "5.30%",
            pool: "0xas...12s",
            status: "open",
            expiry: "365 Day(s)",
        },
        {
            icon: "/Token-Logos/eth-base.svg",
            symbol: "ETH",
            amount: "3",
            usd: "$5.3k",
            apr: "4.57%",
            pool: "0xer...asj",
            status: "closed",
            expiry: "1 Day(s)",
        },
    ];

    const handleToggle = (symbol: string) => {
        setOpenDropdown((prev) => (prev === symbol ? null : symbol));
    };

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-3 text-left">My Borrow Orders</h2>

            <div className="grid grid-cols-7 gap-4 p-4 font-semibold text-sm text-left text-white bg-[#181919] rounded-t-md">
                <span>Assets</span>
                <span>Amount</span>
                <span>APR</span>
                <span>Pool ID</span>
                <span>Status</span>
                <span>Expiry</span>
                <span></span>
            </div>

            <div className="bg-black rounded-b-md p-4">
                {data.map(({ icon, symbol, amount, usd, apr, pool, status, expiry }) => (
                    <div
                        key={symbol + pool}
                        className="grid grid-cols-7 gap-4 py-3 text-sm items-center border-b border-gray-800 relative text-left"
                    >
                        <TokenTagSm icon={icon} symbol={symbol} />

                        <div className="flex flex-col">
                            <span className="font-bold">{amount}</span>
                            <span className="text-xs text-gray-400">{usd}</span>
                        </div>

                        <div className="font-semibold">{apr}</div>
                        <span>{pool}</span>
                        <span>{status}</span>
                        <span>{expiry}</span>

                        {/* Dropdown Toggle */}
                        <div className="relative">
                            <button onClick={() => handleToggle(symbol)}>
                                <img
                                    src="/three-dots.svg"
                                    alt="Menu"
                                    width={5}
                                    height={5}
                                    className="cursor-pointer"
                                />
                            </button>

                            {/* Dropdown */}
                            {openDropdown === symbol && (
                                <div className="absolute top-7 right-0 bg-[#111] border border-gray-700 rounded-md shadow-md z-10 p-2 w-33 flex gap-1">
                                    <CustomBtn1 label="Edit" variant="primary" />
                                    <br/>
                                    <CustomBtn1 label="Close" variant="secondary" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default P2PLendOrdersTable;
