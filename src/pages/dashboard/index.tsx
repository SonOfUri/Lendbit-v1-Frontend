import DashboardCards from "../../components/dashboard/dashboardCards"
import DashboardBorrowPowerCard from "../../components/plugins/DashboardBorrowPowerCard"
import DashboardBorrowsTable from "../../components/plugins/DashboardBorrowsCard"
import DashboardPortfolioTable from "../../components/plugins/DashboardPortfolioTable"
import TransactionHistory from "../../components/plugins/TransactionHistory"

const Dashboard = () => {
  return (
    <div className="w-full py-8">
        <DashboardCards />
        <div className="flex justify-between text-center gap-12 mt-12">
            <DashboardPortfolioTable />
            
            <DashboardBorrowsTable />
        </div>
        
        <div className="flex justify-between text-center gap-12 mt-12">
            <DashboardBorrowPowerCard percentage={80} />
            
            <TransactionHistory />
        </div>
    </div>
  )
}

export default Dashboard