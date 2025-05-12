import DashboardCards from "../../components/Dashboard/dashboardCards"
import DashboardBorrowsTable from "../../components/Dashboard/DashboardBorrowsTable"
import DashboardPortfolioTable from "../../components/Dashboard/DashboardPortfolioTable"
import TransactionHistory from "../../components/plugins/TransactionHistory"
import LoadingState from "../../components/shared/LoadingState"
import useDashboardData from "../../hooks/read/useDashboardData"
import DashboardBorrowPowerCard from "../../components/Dashboard/DashboardBorrowPowerCard"
import { default as DashboardPortfolioTableFromPlugins } from "../../components/plugins/DashboardPortfolioTable.tsx";
import { default as DashboardBorrowsTableFromPlugins } from "../../components/plugins/DashboardBorrowsCard.tsx";



const Dashboard = () => {
    const { dashboardData, dashboardDataLoading, dashboardDataError, isWalletConnected } = useDashboardData()
    

    if (dashboardDataLoading) {
        return (
        <div className="w-full h-screen flex items-center justify-center">
            <LoadingState />
        </div>
        );
    }
	if (dashboardDataError) {
		return <div>Error fetching dashboard data</div>;
	}

  return (

    <div className="w-full px-4 py-2 flex flex-col gap-6  text-white">
          {/* === Top Row Cards === */}
          <DashboardCards dashboardData={dashboardData} />

          {/* === Middle Row Tables === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
              {
                isWalletConnected?
                (<div className="h-full">
                    <DashboardPortfolioTable
                        portfolio={dashboardData?.portfolio ?? { totalValue: 0, assets: [] }}
                        maxWithdrawal={dashboardData?.maxWithdrawal ?? { total: 0, assets: [] }}
                    />
                </div>)
                :
                (<div className="h-full">
                    <DashboardPortfolioTableFromPlugins />
                </div>)
              }
                
              {
                isWalletConnected?
                (<div className="h-full">
                    <DashboardBorrowsTable dashboardData={dashboardData}/>
                </div>)
                :
                (<DashboardBorrowsTableFromPlugins />)
              }
              
          </div>

          {/* === Bottom Row Insights === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <DashboardBorrowPowerCard
                    available={dashboardData?.lending?.availableBorrow ?? 80}
                    totalCollateral={dashboardData?.lending?.totalCollateral ?? 100}
                />
              <TransactionHistory />
          </div>
      </div>
  )
}

export default Dashboard