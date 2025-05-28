import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import IndexPage from './pages/index';
import WalletConnectPage from './pages/WalletConnectPage';
import DashboardPage from './pages/DashboardPage';
import TradingBotPage from './pages/TradingBotPage';
import AssetsAnalysisPage from './pages/AssetsAnalysisPage';
import LogoutPage from './pages/LogoutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/wallet-connect" element={<WalletConnectPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/trading-bot" element={<TradingBotPage />} />
        <Route path="/assets-analysis" element={<AssetsAnalysisPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
