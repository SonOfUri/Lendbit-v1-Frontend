import DashboardCards from "../../components/Dashboard/dashboardCards"
import DashboardBorrowPowerCard from "../../components/plugins/DashboardBorrowPowerCard"
import DashboardBorrowsTable from "../../components/plugins/DashboardBorrowsCard"
import DashboardPortfolioTable from "../../components/plugins/DashboardPortfolioTable"
import TransactionHistory from "../../components/plugins/TransactionHistory"

const Dashboard = () => {
  return (

    <div className="w-full px-4 py-2 flex flex-col gap-6  text-white">
          {/* === Top Row Cards === */}
          <DashboardCards />

          {/* === Middle Row Tables === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
              <div className="h-full"><DashboardPortfolioTable /></div>
              <div className="h-full"><DashboardBorrowsTable /></div>
          </div>

          {/* === Bottom Row Insights === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <DashboardBorrowPowerCard percentage={100} />
              <TransactionHistory />
          </div>
      </div>
  )
}

export default Dashboard