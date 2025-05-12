import { useState } from "react";
import LendBorrowRow from "./LendBorrowRow.tsx";
import FilterModal from "./FilterModal.tsx";
import Dropdown from "./TokenDropdown.tsx";
import { TokenItem } from "../../constants/types/index.ts";

const sampleData = [
    {
        icon: "/Token-Logos/usdc-base.svg",
        symbol: "USDC",
        amount: "9.1K",
        usd: "$9.1k",
        apr: "6.46%",
        poolId: "0xer...asj",
        statusPercent: 60,
        expiry: "1 Day(s)",
    },
    {
        icon: "/Token-Logos/usdt-base.svg",
        symbol: "USDT",
        amount: "9.1K",
        usd: "$9.1k",
        apr: "5.31%",
        poolId: "0xas...12s",
        statusPercent: 35,
        expiry: "23 Day(s)",
    },
    {
        icon: "/Token-Logos/weth-base.svg",
        symbol: "WETH",
        amount: "9.1K",
        usd: "$9.1k",
        apr: "5.31%",
        poolId: "0xas...12s",
        statusPercent: 70,
        expiry: "23 Day(s)",
    },
    {
        icon: "/Token-Logos/eth-base.svg",
        symbol: "ETH",
        amount: "9.1K",
        usd: "$9.1k",
        apr: "5.31%",
        poolId: "0xas...12s",
        statusPercent: 10,
        expiry: "23 Day(s)",
    },
];

const tokenList: TokenItem[] = [
  { symbol: "All Tokens", icon: "" },
  { symbol: "USDC", icon: "/Token-Logos/usdc-base.svg" },
  { symbol: "USDT", icon: "/Token-Logos/usdt-base.svg" },
  { symbol: "ETH", icon: "/Token-Logos/eth-base.svg" },
  { symbol: "WETH", icon: "/Token-Logos/weth-base.svg" },
  { symbol: "WBTC", icon: "/Token-Logos/wbtc-base.svg" },
];

const P2PMarket: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"lend" | "borrow">("borrow");
    const [selectedToken, setSelectedToken] = useState("All Tokens");
    const [showFilterModal, setShowFilterModal] = useState(false);

    const filtered = selectedToken === "All Tokens"
        ? sampleData
        : sampleData.filter(item => item.symbol === selectedToken);

    return (
        <div className="w-full text-white">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-1">
                <div className="flex gap-2 bg-black rounded p-1">
                    <button
                        onClick={() => setActiveTab("lend")}
                        className={`px-4 py-2 rounded ${activeTab === "lend" ? "bg-white text-black font-semibold" : "text-white"}`}
                    >
                        Lend Orders
                    </button>
                    <button
                        onClick={() => setActiveTab("borrow")}
                        className={`px-4 py-2 rounded ${activeTab === "borrow" ? "bg-white text-black font-semibold" : "text-white"}`}
                    >
                        Borrow Orders
                    </button>
                </div>

                <div className="flex gap-3 items-center">
                    <Dropdown selected={selectedToken} setSelected={setSelectedToken} tokenList ={tokenList} />
                    <button
                        onClick={() => setShowFilterModal(true)}
                        className="p-2 "
                    >
                        <img src="/filter-icon.svg" alt="Filter" className="w-15 h-15" />
                    </button>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 text-sm text-white p-4 text-left bg-[#181919] rounded-t-md noise shadow-1">
                <span>Assets</span>
                <span>Amount</span>
                <span>APR</span>
                <span>Pool ID</span>
                <span>Status</span>
                <span>{activeTab === "lend" ? "Duration" : "Expiry"}</span>
                <span></span>
            </div>

            {/* Rows */}
            <div className="bg-black rounded-b-md overflow-hidden noise shadow-1">
                {filtered.map((item, index) => (
                    <LendBorrowRow
                        key={index}
                        {...item}
                        type={activeTab}
                    />
                ))}
            </div>

            {/* Modal */}
            {showFilterModal && (
                <FilterModal onClose={() => setShowFilterModal(false)} />
            )}
        </div>
    );
};

export default P2PMarket;
