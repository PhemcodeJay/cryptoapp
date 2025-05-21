import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import IndexPage from './pages/index'; // Make sure this file exists
import WalletConnectPage from './pages/WalletConnectPage';
import DashboardPage from './pages/DashboardPage';
import TradingBotPage from './pages/TradingBotPage';
import BotConfigPage from './pages/BotConfigPage';
import LogoutPage from './pages/LogoutPage';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/wallet-connect" element={<WalletConnectPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/trading-bot" element={<TradingBotPage />} />
        <Route path="/bot-config" element={<BotConfigPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
