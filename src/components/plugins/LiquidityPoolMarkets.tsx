import LiquidityMarketCard from "./LiquidityMarketCard.tsx";

const ExampleLiquidityMarkets = () => {
    const pools = [
        {
            icon: "/Token-Logos/eth-base.svg",
            name: "ETHEREUM",
            symbol: "ETH",
            riskLevel: "low",
            totalSupplied: "$00.00M",
            suppliedAbbr: "0K",
            supplyApy: "0.00%",
            totalBorrowed: "$0.00M",
            borrowedAbbr: "000",
            borrowApr: "0.000%",
        },
        {
            icon: "/Token-Logos/usdc-base.svg",
            name: "USDC",
            symbol: "USDC",
            riskLevel: "low",
            totalSupplied: "$23.45M",
            suppliedAbbr: "23K",
            supplyApy: "2.46%",
            totalBorrowed: "$12.00M",
            borrowedAbbr: "12K",
            borrowApr: "1.56%",
        },
    ];

    const handleSupply = (symbol: string) => {
        console.log(`Supply clicked for ${symbol}`);
    };

    const handleBorrow = (symbol: string) => {
        console.log(`Borrow clicked for ${symbol}`);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pools.map((pool, idx) => (
                <LiquidityMarketCard
                    key={idx}
                    icon={pool.icon}
                    tokenName={pool.name}
                    tokenSymbol={pool.symbol}
                    riskLevel={pool.riskLevel as "low" | "mid" | "high"}
                    totalSupplied={pool.totalSupplied}
                    supplyApy={pool.supplyApy}
                    totalBorrowed={pool.totalBorrowed}
                    borrowApr={pool.borrowApr}
                    onSupplyClick={() => handleSupply(pool.symbol)}
                    onBorrowClick={() => handleBorrow(pool.symbol)}
                />
            ))}
        </div>
    );
};

export default ExampleLiquidityMarkets;
