import CollateralsTable from "../../components/plugins/CollateralsTable.tsx";
import PositionsBorrowPowerCard from "../../components/plugins/PositionsBorrowPowerCard.tsx";
import Supplies from "../../components/plugins/Supplies.tsx";
import Borrows from "../../components/plugins/Borrows.tsx";
import PortfolioAreaChart from "../../components/Portfolio/PortfolioAreaChart.tsx";
import usePositionData from "../../hooks/read/usePositionData.ts";
import LoadingState from "../../components/shared/LoadingState.tsx";
import ConnectPrompt from "../../components/shared/ConnectPrompt.tsx";
import { formatMoney2 } from "../../constants/utils/formatMoney.ts";
import { useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

const Positions = () => {
	const {
		positionData,
		positionDataLoading,
		positionDataError,
		isWalletConnected,
	} = usePositionData();

	const location = useLocation();
	const activeBorrowTab = location.state?.activeBorrowTab || 'liquidity';
	
	const shouldScrollToBorrows = location.state?.shouldScrollToBorrows;

    useLayoutEffect(() => {
        if (shouldScrollToBorrows) {
            const borrowsSection = document.getElementById('borrows-section');
            if (borrowsSection) {
                borrowsSection.scrollIntoView({ behavior: 'smooth' });
                window.scrollBy(0, -20);
            }
        }
    }, [shouldScrollToBorrows]);

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
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<LoadingState />
				<div className="mt-6">Error: Refetching portfolio data...</div>
			</div>
    )
	}

	console.log(positionData);
	

	return (
		<div className="w-full pt-2 px-4 space-y-8 pb-4">
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
				id="borrows-section"
				borrowFromLP={positionData?.borrowFromLP}
				borrowOrders={positionData?.borrowOrders}
				initialActiveTab={activeBorrowTab}
			/>
		</div>
	);
};

export default Positions;
