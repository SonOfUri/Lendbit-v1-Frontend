import CollateralsTable from "../../components/plugins/CollateralsTable.tsx";
import PositionsBorrowPowerCard from "../../components/plugins/PositionsBorrowPowerCard.tsx";
import Supplies from "../../components/plugins/Supplies.tsx";
import Borrows from "../../components/plugins/Borrows.tsx";
import PortfolioAreaChart from "../../components/plugins/PortfolioAreaChart.tsx";


const Positions = () => {
  return (
      <div className="w-full py-2 px-4 space-y-8">
        {/* 📈 Graph Placeholder */}
          <PortfolioAreaChart />


        {/* 📊 Collateral + Borrow Power */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CollateralsTable />
          <PositionsBorrowPowerCard percentage={100} availableToBorrow={`$1,000`} totalCollateral={`$10,000`} />
        </div>

        {/* 💧 Supplies */}
          <Supplies />

        {/* 📉 Borrows */}
          <Borrows />
      </div>

  )
}

export default Positions