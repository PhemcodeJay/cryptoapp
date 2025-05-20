// client/src/pages/WalletConnectPage.tsx
import React from 'react';

const WalletConnectPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-800 via-purple-700 to-pink-600 text-white px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-4">🔐 Connect Your Wallet</h1>
      <p className="text-lg text-center max-w-xl mb-8 opacity-90">
        To access your portfolio and use the trading bot, please connect a supported Web3 wallet.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => alert('MetaMask connection logic goes here')}
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-300 transition"
        >
          🦊 Connect MetaMask
        </button>

        <button
          onClick={() => alert('Trust Wallet connection logic goes here')}
          className="px-6 py-3 bg-blue-500 font-semibold rounded-lg shadow hover:bg-blue-400 transition"
        >
          🔵 Connect Trust Wallet
        </button>
      </div>

      <p className="mt-10 text-sm text-white text-opacity-80">
        Your wallet remains in your control — we never store private keys.
      </p>
    </div>
  );
};

export default WalletConnectPage;
