import React, { useEffect, useState } from 'react';
import walletService from '../services/walletService';

const PortfolioPage = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const data = await walletService.getWallets();
        setWallets(data || []);
      } catch (error) {
        console.error('Failed to load wallets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Portfolio</h2>
        <p className="text-sm text-gray-500 mb-6">Connected Web3 wallets and token balances</p>

        {loading ? (
          <div className="text-center text-gray-500">Loading wallets...</div>
        ) : wallets.length === 0 ? (
          <div className="text-center text-gray-400">No wallets connected yet.</div>
        ) : (
          <div className="space-y-4">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="bg-white shadow-sm rounded-lg p-4 border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 font-semibold">{wallet.address}</p>
                    <p className="text-xs text-gray-500 uppercase">{wallet.chain}</p>
                  </div>
                  <button
                    className="text-sm text-blue-500 hover:underline"
                    onClick={() => alert(`Viewing wallet: ${wallet.address}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
