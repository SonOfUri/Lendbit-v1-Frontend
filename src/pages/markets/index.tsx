import MetricStatCard from "../../components/plugins/MetricStatcard";
import useMarketData from "../../hooks/read/useMarketData.ts";
import LoadingState from "../../components/shared/LoadingState.tsx";
import LiquidityPoolMarkets from "../../components/Markets/LiquidityPoolMarkets.tsx";
import P2PMarket from "../../components/Markets/P2PMarket.tsx";
// import { default as P2PMarketFromPlugins } from "../../components/plugins/P2PMarket.tsx";

const Markets = () => {
	const { marketData, marketDataLoading, marketDataError } = useMarketData();

	if (marketDataLoading && !marketData) {
        return (
        <div className="w-full h-screen flex items-center justify-center">
            <LoadingState />
        </div>
        );
    }
	if (marketDataError) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<LoadingState />
				<div className="mt-6">Error: Refetching market data...</div>
			</div>
		)
	}

	return (
		<div className="w-full py-2 px-4 space-y-8">
			{/* Top metrics section */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<MetricStatCard
					label="Total Value Locked"
					value={`$${marketData?.tvl.toLocaleString()}`}
				/>
				<MetricStatCard
					label="Total Supplied"
					value={`$${marketData?.totalSupplied.toLocaleString()}`}
				/>
				<MetricStatCard
					label="Total Borrowed"
					value={`$${marketData?.totalBorrowed.toLocaleString()}`}
				/>
			</div>

			{/* Liquidity Pool Markets section */}
			<div>
				<h2 className="text-white text-lg font-semibold mb-4 text-left">
					Liquidity Pool Markets
				</h2>
				<div className="">
					<LiquidityPoolMarkets liquidityPools={marketData?.liquidityPools || []} />
				</div>
			</div>

			{/* Peer-to-Peer Markets section */}
			<div>
				<h2 className="text-white text-lg font-semibold mb-4 text-left">
					Peer-to-Peer Markets
				</h2>
				<P2PMarket p2pMarkets={marketData?.p2pMarkets || { lendOrders: [], borrowOrders: [] }} />
            </div>
            
            {/* <P2PMarketFromPlugins /> */}
		</div>
	);
};

export default Markets;
