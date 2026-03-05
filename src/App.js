import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ParkingProvider } from './context/ParkingContext';
import Navigation from './components/Navigation';
import QuickStatsWidget from './components/QuickStatsWidget';
import BatchOperations from './components/BatchOperations';
import EntranceKiosk from './pages/EntranceKiosk';
import ExitCounter from './pages/ExitCounter';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <ParkingProvider>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<EntranceKiosk />} />
            <Route path="/exit" element={<ExitCounter />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          
          {/* Global Components */}
          <QuickStatsWidget />
          <BatchOperations />
        </div>
      </ParkingProvider>
    </Router>
  );
}

export default App;
