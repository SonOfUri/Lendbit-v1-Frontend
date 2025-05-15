/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import {formatMoney2 } from "../../constants/utils/formatMoney";
import DashboardCard from "../plugins/DashboardCard";

interface DashboardCardsProps {
	dashboardData: any; 
}

const DashboardCards = ({ dashboardData }: DashboardCardsProps) => {

	const navigate = useNavigate();

	const { lending, healthFactor } = dashboardData || {};
	const { totalCollateral = 0, totalSupply = 0, availableBorrow = 0 } = lending || {};
	const { value: healthValue = 0 } = healthFactor || {};


	const handleDeposit = () => {
        navigate("/transact/deposit")
	};
	
	const handleSupply = (asset: string) => {
        navigate("/supply-borrow", {
            state: {
                mode: "supply",
                tokenType: asset
            }
        })
    };

    const handleBorrow = (asset: string) => {
        // console.log(`Borrow clicked for ${asset}`);
        navigate("/supply-borrow", {
            state: {
                mode: "borrow",
                tokenType: asset
            }
        })
    };

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
			<DashboardCard
				title="Total Collateral"
				value={`$${formatMoney2(totalCollateral.toString())}`}

				buttonText="Deposit"
				subLabel="Assets"
				tooltip="Tokens you’ve locked"
				tokenIcons={[
					"/Token-Logos/eth-base.svg",
					"/Token-Logos/usdc-base.svg",
					"/Token-Logos/weth-base.svg",
					"/Token-Logos/usdt-base.svg",
				]}

				onButtonClick={() => handleDeposit()}
			/>

			<DashboardCard
				title="Total Supply"
				value={`$${formatMoney2(totalSupply.toString(undefined, { maximumFractionDigits: 2 }))}`}
				buttonText="Supply"
				subLabel="Net APY"
				subValue="+0.00" // You can compute weighted APY later
				tooltip="Your weighted average APY across assets"

				onButtonClick={() => handleSupply("WETH")}
			/>

			<DashboardCard
				title="Available to borrow"
				value={`$${formatMoney2(availableBorrow.toString(undefined, { maximumFractionDigits: 2 }))}`}
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