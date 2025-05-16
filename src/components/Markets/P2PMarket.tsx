import { useState } from "react";
import TokenDropdown from "../plugins/TokenDropdown";
import LendBorrowRow from "../plugins/LendBorrowRow";
import FilterModal from "../plugins/FilterModal";
import { formatMoney } from "../../constants/utils/formatMoney";
import { TokenItem } from "../../constants/types";
import { tokenMockedData } from "../../constants/utils/tokenMockedData";

interface LendBorrowOrderBase {
  asset: string;
  amount: number;
  apr: number;
  duration: number;
  orderId: string;
}

interface LendOrder extends LendBorrowOrderBase {
  whitelist: string[];
  min_amount: number;
  max_amount: number;
}

// interface BorrowOrder extends LendBorrowOrderBase {
//   // Borrow orders might have different properties if needed
// }

type EnhancedOrder = (LendOrder | LendBorrowOrderBase) & {
  tokenAddress?: string;
  tokenDecimals?: number;
};

function isLendOrder(order: EnhancedOrder): order is LendOrder {
  return 'min_amount' in order && 'max_amount' in order;
}

interface P2PMarkets {
  lendOrders: LendOrder[];
  borrowOrders: LendBorrowOrderBase[];
}

interface P2PMarketProps {
  p2pMarkets: P2PMarkets;
}




const P2PMarket: React.FC<P2PMarketProps> = ({ p2pMarkets }) => {

  // console.log(p2pMarkets);
  
  const [activeTab, setActiveTab] = useState<"lend" | "borrow">("borrow");
  const [selectedToken, setSelectedToken] = useState("All Tokens");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const enhanceOrders = <T extends LendBorrowOrderBase>(orders: T[]) => {
    return orders.map(order => {
      const tokenInfo = tokenMockedData.find(t => t.symbol === order.asset);
      return {
        ...order,
        tokenAddress: tokenInfo?.address,
        tokenDecimals: tokenInfo?.decimals
      };
    });
  };

  const enhancedLendOrders = enhanceOrders(p2pMarkets.lendOrders);
  const enhancedBorrowOrders = enhanceOrders(p2pMarkets.borrowOrders);

  const orders = activeTab === "lend" ? enhancedLendOrders : enhancedBorrowOrders;

  const filteredOrders = selectedToken === "All Tokens" 
    ? orders 
    : orders.filter(item => item.asset === selectedToken);
    
  const availableTokens = [
    ...new Set(orders.map((order) => order.asset))
  ];
  
  const tokenList: TokenItem[] = availableTokens.length > 0
    ? [
        { symbol: "All Tokens", icon: "" },
        ...availableTokens.map(symbol => {
          const tokenInfo = tokenMockedData.find(t => t.symbol === symbol);
          return {
            symbol,
            icon: `/Token-Logos/${symbol.toLowerCase()}-base.svg`,
            address: tokenInfo?.address,
            decimals: tokenInfo?.decimals,
            name: tokenInfo?.name,
            price: tokenInfo?.price
          };
        })
      ]
    : tokenMockedData.map(token => ({
        symbol: token.symbol,
        icon: `/Token-Logos/${token.symbol.toLowerCase()}-base.svg`,
        address: token.address,
        decimals: token.decimals,
        name: token.name,
        price: token.price
    }));
  
  
  return (
    <div className="w-full text-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex gap-2 bg-[#050505] rounded p-1">
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
        <span>{activeTab === "lend" ? "APR" : "APY"}</span>
        <span>Pool ID</span>
        <span>Status</span>
        <span>{activeTab === "lend" ? "Duration" : "Expiry"}</span>
        <span></span>
      </div>

      {/* Rows */}
      <div className="bg-[#050505] rounded-b-md overflow-hidden noise shadow-1 overflow-y-scroll h-max-[500px]">
        {filteredOrders.map((item, index) => {
          const tokenInfo = tokenMockedData.find(t => t.symbol === item.asset);
          return (
            <LendBorrowRow
              key={index}
              icon={`/Token-Logos/${item.asset.toLowerCase()}-base.svg`}
              symbol={item.asset}
              amount={item.amount.toString()}
              usd={`$${formatMoney((item.amount * (tokenInfo?.price || 1)).toString())}`}
              apr={`${item.apr}%`}
              poolId={item.orderId}
              statusPercent={70}
              expiry={`${item.duration} Day(s)`}
              type={activeTab}
              tokenAddress={item.tokenAddress}
              tokenDecimals={item.tokenDecimals}
              minAmount={isLendOrder(item) ? item.min_amount : undefined}
              maxAmount={isLendOrder(item) ? item.max_amount : undefined}
            />
          );
        })}
      </div>

      {/* Modal */}
      {showFilterModal && (
        <FilterModal onClose={() => setShowFilterModal(false)} />
      )}
    </div>
  );
};

export default P2PMarket;