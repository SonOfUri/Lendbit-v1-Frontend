
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashboard';
import Markets from './pages/markets';
import Plugins from './pages/plugins';


function App() {

  return (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/markets" element={<Markets />} />
        {/* <Route path="/create/:id" element={<CreateOrder />} />
        <Route path="/supply-borrow/:id" element={<Transact />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/allocation" element={<Allocation />} /> */}
        
        <Route path="/plugins" element={<Plugins />} />create

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
