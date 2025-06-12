
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Markets from './pages/markets';
import Positions from './pages/positions';
import SupplyBorrow from "./pages/supplyBorrow";

import './App.css';
import CreateOrder from './pages/createOrder';
import Allocation from './pages/createOrder/allocation';
import Transact from './pages/transact';
import TransactionHistory from "./pages/TransactionsPage";



function App() {

  return (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/supply-borrow" element={<SupplyBorrow />} />
        
        <Route path="/transact/:id" element={<Transact />} />
        <Route path="/create/:id" element={<CreateOrder />} />
        <Route path="/allocation" element={<Allocation />} />
        <Route path="/transactions" element={<TransactionHistory />} />

        
        
        {/* <Route path="/plugins" element={<Plugins />} />create */}

        <Route
          path="*"
          element={
            <div>
              <h1>404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
  )
}

export default App
