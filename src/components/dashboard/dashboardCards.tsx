/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { formatMoney2 } from "../../constants/utils/formatMoney";
import DashboardCard from "../plugins/DashboardCard";

interface DashboardCardsProps {
    dashboardData: any; 
}

const DashboardCards = ({ dashboardData }: DashboardCardsProps) => {
    const navigate = useNavigate();

    const { lending, healthFactor, portfolio } = dashboardData || {};
    const { totalCollateral = 0, totalSupply = 0, availableBorrow = 0, collateralAssets = [] } = lending || {};
    const { value: healthValue = 0 } = healthFactor || {};
    const { netApy = 0, assets = [] } = portfolio || {};

    // Calculate net APY from supplied assets (non-collateral assets with APY)
    const calculatedNetApy = assets.reduce((total: number, asset: any) => {
        if (!asset.isCollateral && asset.apy) {
            return total + (asset.value * asset.apy);
        }
        return total;
    }, 0) / (totalSupply || 1); // Avoid division by zero

    // Get token icons for collateral assets
    const collateralIcons = collateralAssets.map((asset: string) => 
        `/Token-Logos/${asset.toLowerCase()}-base.svg`
    );

    const handleDeposit = () => {
        navigate("/transact/deposit");
    };
    
    const handleSupply = (asset: string) => {
        navigate("/supply-borrow", {
            state: {
                mode: "supply",
                tokenType: asset
            }
        });
    };

    const handleBorrow = (asset: string) => {
        navigate("/supply-borrow", {
            state: {
                mode: "borrow",
                tokenType: asset
            }
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardCard
                title="Total Collateral"
                value={`$${formatMoney2(totalCollateral.toString())}`}
                buttonText="Deposit"
                subLabel="Assets"
                tooltip="Tokens you've locked"
                tokenIcons={collateralIcons}
                onButtonClick={() => handleDeposit()}
            />

            <DashboardCard
                title="Total Supply"
                value={`$${formatMoney2(totalSupply.toString())}`}
                buttonText="Supply"
                subLabel="Net APY"
                subValue={`+${(netApy || calculatedNetApy).toFixed(2)}%`}
                tooltip="Your weighted average APY across assets"
                onButtonClick={() => handleSupply("WETH")}
            />

            <DashboardCard
                title="Available to borrow"
                value={`$${formatMoney2(availableBorrow.toString())}`}
                buttonText="Borrow"
                subLabel="Health Factor"
                subValue={`${Math.min((healthValue / 1.5) * 100, 100).toFixed(0)}%`}
                tooltip="Your current borrowing risk level"
                showHealthBar
                onButtonClick={() => handleBorrow("WETH")}
            />
        </div>
    );
};

export default DashboardCards;