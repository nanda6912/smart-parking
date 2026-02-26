import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ParkingProvider } from './context/ParkingContext';
import EntranceKiosk from './pages/EntranceKiosk';
import ExitAdminPanel from './pages/ExitAdminPanel';
import './index.css';

function App() {
  return (
    <Router>
      <ParkingProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<EntranceKiosk />} />
            <Route path="/panel" element={<ExitAdminPanel />} />
          </Routes>
        </div>
      </ParkingProvider>
    </Router>
  );
}

export default App;
