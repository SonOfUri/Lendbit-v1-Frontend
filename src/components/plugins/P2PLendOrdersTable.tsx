import { useState } from "react";
import TokenTagSm from "./TokenTagSm.tsx";
import CustomBtn1 from "./CustomBtn1.tsx";

const P2PLendOrdersTable = () => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const data = [
        {
            icon: "/Token-Logos/usdc-base.svg",
            symbol: "USDC",
            amount: "9.1K",
            usd: "$9.1k",
            apy: "6.46%",
            pool: "0xer...asj",
            status: "open",
            expiry: "12 Day(s)",
        },
        {
            icon: "/Token-Logos/usdt-base.svg",
            symbol: "USDT",
            amount: "9.1K",
            usd: "$9.1k",
            apy: "5.31%",
            pool: "0xas...12s",
            status: "open",
            expiry: "23 Day(s)",
        },
        {
            icon: "/Token-Logos/weth-base.svg",
            symbol: "WETH",
            amount: "12",
            usd: "$21.5k",
            apy: "5.30%",
            pool: "0xas...12s",
            status: "open",
            expiry: "365 Day(s)",
        },
        {
            icon: "/Token-Logos/eth-base.svg",
            symbol: "ETH",
            amount: "3",
            usd: "$5.3k",
            apy: "4.57%",
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
            <h2 className="text-xl font-bold text-left py-4">My Lend Orders</h2>

            <div className="grid grid-cols-7 gap-4  font-semibold text-sm text-left text-white bg-[#191818] p-4 rounded-t-md noise shadow-1">
                <span>Assets</span>
                <span>Amount</span>
                <span>APY</span>
                <span>Pool ID</span>
                <span>Status</span>
                <span>Expiry</span>
                <span></span>
            </div>

            <div className="bg-[#050505] p-4 rounded-b-md noise shadow-1">
                {data.map(({ icon, symbol, amount, usd, apy, pool, status, expiry }) => (
                    <div
                        key={symbol + pool}
                        className="grid grid-cols-7 gap-4 py-3 text-sm items-center relative text-left"
                    >
                        <TokenTagSm icon={icon} symbol={symbol} />

                        <div className="flex flex-col">
                            <span className="font-bold">{amount}</span>
                            <span className="text-xs text-gray-400">{usd}</span>
                        </div>

                        <div className="font-semibold">{apy}</div>
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
