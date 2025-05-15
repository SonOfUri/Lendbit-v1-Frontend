
import TransactionHistory from "../../components/plugins/TransactionHistory"
import LoadingState from "../../components/shared/LoadingState"
import useDashboardData from "../../hooks/read/useDashboardData"
import { default as DashboardPortfolioTableFromPlugins } from "../../components/plugins/DashboardPortfolioTable.tsx";
import { default as DashboardBorrowsTableFromPlugins } from "../../components/plugins/DashboardBorrowsCard.tsx";
import DashboardCards from "../../components/dashboard/dashboardCards.tsx";
import DashboardPortfolioTable from "../../components/dashboard/DashboardPortfolioTable.tsx";
import DashboardBorrowsTable from "../../components/dashboard/DashboardBorrowsTable.tsx";
import DashboardBorrowPowerCard from "../../components/dashboard/DashboardBorrowPowerCard.tsx";



const Dashboard = () => {
  const { dashboardData, dashboardDataLoading, dashboardDataError, isWalletConnected } = useDashboardData();
  
  // Safe default values
  const safeDashboardData = {
    lending: dashboardData?.lending ?? {
      borrows: [],
      totalCollateral: 0,
      totalSupply: 0,
      availableBorrow: 0
    },
    portfolio: dashboardData?.portfolio ?? {
      totalValue: 0,
      assets: []
    },
    maxWithdrawal: dashboardData?.maxWithdrawal ?? {
      total: 0,
      assets: []
    },
    healthFactor: dashboardData?.healthFactor ?? {
      value: 0,
      status: "SAFE",
      maxBorrow: 0
    }
  };

  if (dashboardDataLoading && !dashboardData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (dashboardDataError) {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <LoadingState />
            <div className="mt-6">Error: Refetching dashboard data...</div>
        </div>
    )
  }

  return (
    <div className="w-full px-4 py-2 flex flex-col gap-6 text-white">
      {/* === Top Row Cards === */}
      <DashboardCards dashboardData={safeDashboardData} />

      {/* === Middle Row Tables === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {isWalletConnected ? (
          <div className="h-full">
            <DashboardPortfolioTable
              portfolio={safeDashboardData.portfolio}
              maxWithdrawal={safeDashboardData.maxWithdrawal}
            />
          </div>
        ) : (
          <div className="h-full">
            <DashboardPortfolioTableFromPlugins />
          </div>
        )}
        
        {isWalletConnected ? (
          <div className="h-full">
            <DashboardBorrowsTable 
              dashboardData={{
                lending: safeDashboardData.lending,
                portfolio: safeDashboardData.portfolio
              }} 
            />
          </div>
        ) : (
          <DashboardBorrowsTableFromPlugins />
        )}
      </div>

      {/* === Bottom Row Insights === */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        <div className="lg:col-span-4">
          <DashboardBorrowPowerCard
            available={safeDashboardData.lending.availableBorrow}
            totalCollateral={safeDashboardData.lending.totalCollateral}
          />
        </div>
        <div className="lg:col-span-6">
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard