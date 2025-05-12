import { useState } from "react";
import TokenDropdown from "../plugins/TokenDropdown";
import LendBorrowRow from "../plugins/LendBorrowRow";
import FilterModal from "../plugins/FilterModal";
import { formatMoney } from "../../constants/utils/formatMoney";
import { TokenItem } from "../../constants/types";

interface LendBorrowOrder {
  asset: string;
  amount: number;
  apr: number;
  duration: number;
  orderId: string;
}

interface P2PMarkets {
  lendOrders: LendBorrowOrder[];
  borrowOrders: LendBorrowOrder[];
}
interface P2PMarketProps {
  p2pMarkets: P2PMarkets;
}



const mockedTokenList: TokenItem[] = [
  { symbol: "All Tokens", icon: "" },
  { symbol: "USDC", icon: "/Token-Logos/usdc-base.svg" },
  { symbol: "USDT", icon: "/Token-Logos/usdt-base.svg" },
  { symbol: "ETH", icon: "/Token-Logos/eth-base.svg" },
  { symbol: "WETH", icon: "/Token-Logos/weth-base.svg" },
  { symbol: "WBTC", icon: "/Token-Logos/wbtc-base.svg" },
];


const P2PMarket: React.FC<P2PMarketProps> = ({ p2pMarkets }) => {
  const [activeTab, setActiveTab] = useState<"lend" | "borrow">("borrow");
  const [selectedToken, setSelectedToken] = useState("All Tokens");
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Combine lend and borrow orders based on the active tab
  const orders =
    activeTab === "lend" ? p2pMarkets.lendOrders : p2pMarkets.borrowOrders;

  const filteredOrders = selectedToken === "All Tokens" 
    ? orders 
    : orders.filter(item => item.asset === selectedToken);
    
  const availableTokens = [
    ...new Set(orders.map((order) => order.asset))
  ];

  const tokenList: TokenItem[] = availableTokens.length > 0
  ? [
      { symbol: "All Tokens", icon: "" },
      ...availableTokens.map(symbol => ({
        symbol,
        icon: `/Token-Logos/${symbol.toLowerCase()}-base.svg`,
      }))
    ]
  : mockedTokenList;

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
          <TokenDropdown selected={selectedToken} setSelected={setSelectedToken} tokenList ={tokenList} />
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
        {filteredOrders.map((item, index) => (
          <LendBorrowRow
            key={index}
            icon={`/Token-Logos/${item.asset.toLowerCase()}-base.svg`} 
            symbol={item.asset}
            amount={formatMoney(item.amount.toString())}
            usd={`$${formatMoney((item.amount * 1000).toString())}`} // Example calculation for USD value, adjust based on actual data
            apr={`${item.apr}%`}
            poolId={item.orderId} 
            statusPercent={0} // Status could be a placeholder or derived from another value
            expiry={`${item.duration} Day(s)`} // Convert duration to a string format
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