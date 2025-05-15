import HealthBar from "../../components/plugins/HealthBar.tsx";
import MeterGauge from "../../components/plugins/MeterGauge.tsx";
import PercentageTag from "../../components/plugins/PercentageTag.tsx";

import TokenTagSm from "../../components/plugins/TokenTagSm.tsx";
import TokenTagLg from "../../components/plugins/TokenTagLg.tsx";
import RangeSlider from "../../components/plugins/RangeSlider.tsx";

import MetricStatCard from "../../components/plugins/MetricStatcard.tsx";
import DashboardPortfolioTable from "../../components/plugins/DashboardPortfolioTable.tsx";
import DashboardBorrowsTable from "../../components/plugins/DashboardBorrowsCard.tsx";
import DashboardBorrowPowerCard from "../../components/plugins/DashboardBorrowPowerCard.tsx";
import TransactionHistory from "../../components/plugins/TransactionHistory.tsx";
import PositionsBorrowPowerCard from "../../components/plugins/PositionsBorrowPowerCard.tsx";
import Supplies from "../../components/plugins/Supplies.tsx";
import Borrows from "../../components/plugins/Borrows.tsx";
import CollateralsTable from "../../components/plugins/CollateralsTable.tsx";
import LiquidityPoolMarkets from "../../components/plugins/LiquidityPoolMarkets.tsx";
import P2PMarket from "../../components/plugins/P2PMarket.tsx";

const Plugins = () => {
  return (
     <div className="w-full">
            <HealthBar percentage={50} />
            <br/>
            <MeterGauge percentage={100} />
            <br/>
            <PercentageTag percentage={100} />
            <br/>
            <br/>
            <PercentageTag percentage={90} />
            <br/>
            {/* <AssetSelector
                onTokenSelect={(token, price) => console.log(token, price)}
                onAssetValueChange={(val) => console.log("Value:", val)}
                assetValue="1.5"
                userAddress="0x123"
                actionType="supply"
            /> */}
            <br/>
            <TokenTagSm icon="/Token-Logos/weth-base.svg" symbol="WETH" />
            <br/>
            <TokenTagLg icon="/Token-Logos/eth-base.svg" name="ETHEREUM" symbol="ETH" />
            <br/>
            <RangeSlider
                min={0}
                max={10000}
                initialMin={200}
                initialMax={8600}
                onChange={({ min, max }) => console.log("Range:", min, "-", max)}
            />
            <br/>
            {/* <LoanControl amount={17200} type="APY" tokenSymbol="ETH" />
            <br/>
            <LoanControl amount={17200} type="APR" tokenSymbol="USDC" />
            <br/>
            <AddRecipients /> */}
            <br/>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
                <MetricStatCard label="Total Value Locked" value="$12,700,000" />
                <MetricStatCard label="Total Supplied" value="$8,500,000" />
                <MetricStatCard label="Total Borrowed" value="$4,200,000" />
            </div>
            <br/>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* <DashboardCard
                    title="Total Collateral"
                    value="$0.00"
                    buttonText="Deposit"
                    subLabel="Assets"
                    tooltip="Tokens you’ve locked"
                    tokenIcons={["/Token-Logos/eth-base.svg", "/Token-Logos/usdc-base.svg", "/Token-Logos/weth-base.svg", "/Token-Logos/usdt-base.svg"]}
                /> */}

                {/* <DashboardCard
                    title="Total Supply"
                    value="$0.00"
                    buttonText="Supply"
                    subLabel="Net APY"
                    subValue="+0.00"
                    tooltip="Your weighted average APY across assets"
                /> */}

                {/* <DashboardCard
                    title="Available to borrow"
                    value="$0.00"
                    buttonText="Borrow"
                    subLabel="Health Factor"
                    subValue="100%"
                    tooltip="Your current borrowing risk level"
                    showHealthBar
                /> */}

            </div>

            <br/>

            <DashboardPortfolioTable />
            <br/>
            <DashboardBorrowsTable />
            <br/>
            <DashboardBorrowPowerCard percentage={100} />
    <br/>
            <TransactionHistory />
            <br/>
            <PositionsBorrowPowerCard
                percentage={20}
                totalCollateral="$12,345.67"
                availableToBorrow="$2,345.67"
            />
            <br/>
            <Supplies />
            <br/>
            <Borrows />
            <br/>
            <CollateralsTable />
            <br/>
            <LiquidityPoolMarkets/>
            <br/>
            <P2PMarket />
        </div>
  )
}

export default Plugins