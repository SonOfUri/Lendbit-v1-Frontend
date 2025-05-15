import { useNavigate } from "react-router-dom";
import { formatMoney } from "../../constants/utils/formatMoney";
import LiquidityMarketCard from "../plugins/LiquidityMarketCard";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

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
    LINK: "ChainLink",
    
};

    const sliderSettings = {
        dots: true, // Enable navigation dots
        infinite: true, // Loop through slides infinitely
        speed: 500, // Transition speed
        slidesToShow: 4, // Number of slides visible at one time
        slidesToScroll: 1, // Number of slides to scroll on navigation
        autoplay: true, // Enable autoplay
        autoplaySpeed: 3000, // 3 seconds between transitions
        pauseOnHover: true, // Pause autoplay when hovering over a slide
        responsive: [
            {
                breakpoint: 1024, // Adjust for tablets
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768, // Adjust for small tablets or larger phones
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480, // Adjust for mobile phones
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };


const LiquidityPoolMarkets: React.FC<LiquidityPoolProps> = ({ liquidityPools }) => {
    const navigate = useNavigate();

    const handleSupply = (asset: string) => {
        console.log(`Supply clicked for ${asset}`);
        navigate("/supply-borrow", {
            state: {
                mode: "supply",
                tokenType: asset
            }
        })
    };

    const handleBorrow = (asset: string) => {
        console.log(`Borrow clicked for ${asset}`);
        navigate("/supply-borrow", {
            state: {
                mode: "borrow",
                tokenType: asset
            }
        })
    };

    return (
        <Slider {...sliderSettings}>
            {liquidityPools.map((pool, idx) => {
                const fullName = tokenNames[pool.asset] || pool.asset;
                return (
                    <div key={idx} className="px-2"> {/* Add padding between slides */}
                        <LiquidityMarketCard
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
                    </div>
                );
            })}
        </Slider>
    );
};

export default LiquidityPoolMarkets;


 