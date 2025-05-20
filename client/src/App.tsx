import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import IndexPage from './pages/index';
import WalletConnectPage from './pages/WalletConnectPage';
import DashboardPage from './pages/DashboardPage';
import TradingBotPage from './pages/TradingBotPage';
import LogoutPage from './pages/LogoutPage';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* Your app routes */}
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/wallet-connect" element={<WalletConnectPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/trading-bot" element={<TradingBotPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
