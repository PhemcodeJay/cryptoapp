// client/src/pages/index.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const IndexPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-blue-600 to-indigo-900 text-white flex flex-col items-center justify-center px-6 py-10">
      <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">🚀 Welcome to CryptoPilot</h1>
      <p className="text-lg max-w-2xl text-center mb-10 opacity-90">
        Your all-in-one platform to monitor your crypto portfolio, run intelligent trading bots,
        and connect seamlessly with Web3 wallets like MetaMask or Trust Wallet.
      </p>

      <div className="flex flex-wrap gap-6 justify-center mb-12">
        <Link
          to="/wallet-connect"
          className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transition"
        >
          🔐 Connect Wallet
        </Link>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-400 transition"
        >
          📊 View Dashboard
        </Link>
      </div>

      <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-xl max-w-3xl text-left">
        <h2 className="text-2xl font-bold mb-2">💡 Why CryptoPilot?</h2>
        <ul className="list-disc list-inside space-y-2 text-white text-opacity-90">
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
