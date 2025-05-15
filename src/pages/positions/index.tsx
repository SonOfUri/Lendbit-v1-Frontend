import CollateralsTable from "../../components/plugins/CollateralsTable.tsx";
import PositionsBorrowPowerCard from "../../components/plugins/PositionsBorrowPowerCard.tsx";
import Supplies from "../../components/plugins/Supplies.tsx";
import Borrows from "../../components/plugins/Borrows.tsx";
import PortfolioAreaChart from "../../components/Portfolio/PortfolioAreaChart.tsx";
import usePositionData from "../../hooks/read/usePositionData.ts";
import LoadingState from "../../components/shared/LoadingState.tsx";
import ConnectPrompt from "../../components/shared/ConnectPrompt.tsx";
import { formatMoney2 } from "../../constants/utils/formatMoney.ts";

const Positions = () => {
	const {
		positionData,
		positionDataLoading,
		positionDataError,
		isWalletConnected,
	} = usePositionData();

	if (positionDataLoading && !positionData) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<LoadingState />
			</div>
		);
	}
	if (!isWalletConnected) {
		return (
			<div className="font-kaleko py-6 h-screen">
				<div className="w-full m-auto">
					<h3 className="text-lg text-white px-2 mb-2">Portfolio</h3>
					<ConnectPrompt />
				</div>
			</div>
		);
	}

	if (positionDataError) {
		return <div>Error fetching portfolio data</div>;
	}

	return (
		<div className="w-full py-2 px-4 space-y-8">
			{/* 📈 Graph Placeholder */}
			<PortfolioAreaChart positionData={positionData} />

			{/* 📊 Collateral + Borrow Power */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<CollateralsTable collateralAssets={positionData?.collateralAssets} />

				<PositionsBorrowPowerCard
					percentage={positionData?.borrowPowerLeft || 0}
					availableToBorrow={`$${formatMoney2(
						positionData?.availableToBorrow || 0
					)}`}
					totalCollateral={`$${formatMoney2(
						positionData?.totalCollateral || 0
					)}`}
				/>
			</div>

			{/* 💧 Supplies */}
			<Supplies
				supplyToLP={positionData?.supplyToLP}
				lendOrders={positionData?.lendOrders}
			/>

			{/* 📉 Borrows */}
			<Borrows
				borrowFromLP={positionData?.borrowFromLP}
				borrowOrders={positionData?.borrowOrders}
			/>
		</div>
	);
};

export default Positions;
