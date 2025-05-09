import MetricStatCard from "../../components/plugins/MetricStatcard"
import LiquidityPoolMarkets from "../../components/plugins/LiquidityPoolMarkets.tsx";
import P2PMarket from "../../components/plugins/P2PMarket.tsx";


const Markets = () => {
  return (
      <div className="w-full py-2 px-4 space-y-8">
          {/* Top metrics section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricStatCard label="Total Value Locked" value="$12,700,000" />
               <MetricStatCard label="Total Supplied" value="$8,500,000" />
              <MetricStatCard label="Total Borrowed" value="$4,200,000" />
          </div>

          {/* Liquidity Pool Markets section */}
          <div>
              <h2 className="text-white text-lg font-semibold mb-4 text-left">Liquidity Pool Markets</h2>
              <div className="">
                  <LiquidityPoolMarkets/>
              </div>
          </div>

          {/* Peer-to-Peer Markets section */}
          <div>
              <h2 className="text-white text-lg font-semibold mb-4 text-left">Peer-to-Peer Markets</h2>
              <P2PMarket />
          </div>
      </div>

  )
}

export default Markets