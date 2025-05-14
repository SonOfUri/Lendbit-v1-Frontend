import { useNavigate } from "react-router-dom";
import { formatMoney } from "../../constants/utils/formatMoney";
import LiquidityMarketCard from "../plugins/LiquidityMarketCard";

interface LiquidityPoolProps {
    liquidityPools: {
        asset: string;
        riskLevel: "LOW" | "MEDIUM" | "HIGH";
        totalSupplied: number;
        supplyApy: number;
        totalBorrowed: number;
        borrowApr: number;
        utilizationRate: number;
    }[];
}

const tokenNames: { [key: string]: string } = {
    ETH: "Ethereum",
    USDC: "USD Coin",
    WBTC: "Wrapped BTC",
    USDT: "Tether",
    WETH: "Wrapped ETH",
};


const LiquidityPoolMarkets: React.FC<LiquidityPoolProps> = ({ liquidityPools }) => {
    const navigate = useNavigate();

    const handleSupply = (asset: string) => {
        console.log(`Supply clicked for ${asset}`);
    };

    const handleBorrow = (asset: string) => {
        console.log(`Borrow clicked for ${asset}`);
        navigate("/supply-borrow")
    };

    return (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {liquidityPools.map((pool, idx) => {
                const fullName = tokenNames[pool.asset] || pool.asset;
                return (
                    <LiquidityMarketCard
                        key={idx}
                        icon={`/Token-Logos/${pool.asset.toLowerCase()}-base.svg`} 
                        tokenName={fullName}
                        tokenSymbol={pool.asset}
                        riskLevel={pool.riskLevel.toLowerCase() as "low" | "mid" | "medium" | "high"}
                        totalSupplied={`$${formatMoney(pool.totalSupplied.toString())}`}
                        supplyApy={`${pool.supplyApy}%`}
                        totalBorrowed={`$${formatMoney(pool.totalBorrowed.toString())}`}
                        borrowApr={`${pool.borrowApr}%`}
                        onSupplyClick={() => handleSupply(pool.asset)}
                        onBorrowClick={() => handleBorrow(pool.asset)}
                    />
                );
            })}
        </div>
    );
};

export default LiquidityPoolMarkets;


 