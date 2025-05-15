import DashboardCard from "./DashboardCard";

const DashboardCards = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
			<DashboardCard
				title="Total Collateral"
				value="$0.00"
				buttonText="Deposit"
				subLabel="Assets"
				tooltip="Tokens you’ve locked"
				tokenIcons={[
					"/Token-Logos/eth-base.svg",
					"/Token-Logos/usdc-base.svg",
					"/Token-Logos/weth-base.svg",
					"/Token-Logos/usdt-base.svg",
				]} onButtonClick={function (): void {
				throw new Error("Function not implemented.");
			}}			/>

			<DashboardCard
				title="Total Supply"
				value="$0.00"
				buttonText="Supply"
				subLabel="Net APY"
				subValue="+0.00"
				tooltip="Your weighted average APY across assets" onButtonClick={function (): void {
				throw new Error("Function not implemented.");
			}}			/>

			<DashboardCard
				title="Available to borrow"
				value="$0.00"
				buttonText="Borrow"
				subLabel="Health Factor"
				subValue="100%"
				tooltip="Your current borrowing risk level"
				showHealthBar onButtonClick={function (): void {
				throw new Error("Function not implemented.");
			}}			/>
		</div>
	);
};

export default DashboardCards;
