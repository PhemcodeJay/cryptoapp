import React from 'react';
import { Link } from 'react-router-dom';

function NavigationButtons() {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-10">
      <Link
        to="/wallet-connect"
        className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-xl shadow transition duration-200"
      >
        🔐 Connect Wallet
      </Link>
      <Link
        to="/dashboard"
        className="bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-200"
      >
        📊 View Dashboard
      </Link>
      <Link
        to="/trading-bot"
        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-200"
      >
        🤖 Trading Bot
      </Link>
<Link
        to="/assets-analysis"
        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-200"
      >
        🤖 Assets Analysis
      </Link>

      <Link
        to="/logout"
        className="bg-red-500 hover:bg-red-400 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-200"
      >
        🚪 Logout
      </Link>
    </div>
  );
}

const IndexPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">🚀 Welcome to CryptoPilot</h1>
        <p className="text-lg text-gray-300">
          Your all-in-one platform to monitor your crypto portfolio, run intelligent trading bots,
          and connect seamlessly with Web3 wallets like MetaMask or Trust Wallet.
        </p>
      </div>

      <NavigationButtons />

      <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl max-w-xl w-full p-6">
        <h2 className="text-2xl font-bold mb-4">💡 Why CryptoPilot?</h2>
        <ul className="space-y-2 text-gray-200">
          <li>🔎 Real-time crypto tracking with price alerts</li>
          <li>🤖 Automated trading bot with configurable strategies</li>
          <li>🔗 Secure wallet connection using MetaMask or Trust Wallet</li>
          <li>📈 Visual analytics to help you trade smarter</li>
        </ul>
      </div>
    </div>
  );
};

export default IndexPage;