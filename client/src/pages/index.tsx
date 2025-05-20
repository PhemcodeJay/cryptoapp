import React from 'react';
import { Link } from 'react-router-dom';

function NavigationButtons() {
  return (
    <div className="d-flex gap-3 mb-5 flex-wrap justify-content-center">
      <Link
        to="/wallet-connect"
        className="btn btn-warning btn-lg text-dark fw-semibold shadow-sm"
      >
        🔐 Connect Wallet
      </Link>
      <Link
        to="/dashboard"
        className="btn btn-success btn-lg fw-semibold shadow-sm"
      >
        📊 View Dashboard
      </Link>
      <Link
        to="/trading-bot"
        className="btn btn-primary btn-lg fw-semibold shadow-sm"
      >
        🤖 Trading Bot
      </Link>
      <Link
        to="/logout"
        className="btn btn-danger btn-lg fw-semibold shadow-sm"
      >
        🚪 Logout
      </Link>
    </div>
  );
}

const IndexPage: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-dark text-light p-4">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">🚀 Welcome to CryptoPilot</h1>
        <p className="lead mx-auto" style={{ maxWidth: '600px' }}>
          Your all-in-one platform to monitor your crypto portfolio, run intelligent trading bots,
          and connect seamlessly with Web3 wallets like MetaMask or Trust Wallet.
        </p>
      </div>

      {/* Navigation Buttons inserted here */}
      <NavigationButtons />

      <div
        className="card bg-secondary bg-opacity-25 text-light shadow-lg"
        style={{ maxWidth: '600px' }}
      >
        <div className="card-body">
          <h2 className="card-title fw-bold mb-3">💡 Why CryptoPilot?</h2>
          <ul className="list-group list-group-flush">
            <li className="list-group-item bg-transparent text-light border-0 ps-0">
              🔎 Real-time crypto tracking with price alerts
            </li>
            <li className="list-group-item bg-transparent text-light border-0 ps-0">
              🤖 Automated trading bot with configurable strategies
            </li>
            <li className="list-group-item bg-transparent text-light border-0 ps-0">
              🔗 Secure wallet connection using MetaMask or Trust Wallet
            </li>
            <li className="list-group-item bg-transparent text-light border-0 ps-0">
              📈 Visual analytics to help you trade smarter
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
