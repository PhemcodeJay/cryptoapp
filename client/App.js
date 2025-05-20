import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Index from '../pages/index';  // your index.jsx page
import BotConfigPage from '../pages/BotConfigPage';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import PortfolioPage from '../pages/PortfolioPage';
import RegisterPage from '../pages/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/bot-config" element={<BotConfigPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
