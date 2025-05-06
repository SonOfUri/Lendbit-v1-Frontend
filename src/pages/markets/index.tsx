import MetricStatCard from "../../components/plugins/MetricStatcard"
import LiquidityPoolMarkets from "../../components/plugins/LiquidityPoolMarkets.tsx";


const Markets = () => {
  return (
    <div className="w-full py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full max-w-4xl mx-auto">
            <MetricStatCard label="Total Value Locked" value="$12,700,000" />
            <MetricStatCard label="Total Supplied" value="$8,500,000" />
            <MetricStatCard label="Total Borrowed" value="$4,200,000" />
        </div>
        <div className="flex justify-between text-center gap-12 mt-12">
            <h5>Liquidity Pool Markets</h5>
            
            <LiquidityPoolMarkets/>
        </div>
        
        <div className="flex justify-between text-center gap-12 mt-12">
            
        </div>
    </div>
  )
}

export default Markets