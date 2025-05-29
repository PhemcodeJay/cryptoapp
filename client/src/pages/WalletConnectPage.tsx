import React, { useState, useEffect } from 'react';
import walletService from '../../services/walletService';

const supportedChains = [
  { id: 'eth', label: 'Ethereum' },
  { id: 'bsc', label: 'BNB Chain' },
  { id: 'matic', label: 'Polygon' },
  { id: 'sol', label: 'Solana' },
];

const WalletConnectPage: React.FC = () => {
  const [connecting, setConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chain, setChain] = useState<string>('eth');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  const syncWallet = async (address: string, selectedChain: string) => {
    try {
      const response = await walletService.syncWallet(address, selectedChain);
      setMessage(response.message || 'Wallet synced successfully!');
      await fetchPortfolio(address, selectedChain);
    } catch (err: any) {
      console.error('Sync error:', err);
      setError(err.message || 'Sync failed');
    }
  };

  const fetchPortfolio = async (address: string, selectedChain: string) => {
    try {
      const response = await walletService.getPortfolio(address, selectedChain);
      setBalance(response.balance ?? 0);
    } catch (err: any) {
      console.error('Fetch portfolio failed:', err);
      setError(err.message || 'Failed to fetch portfolio');
    }
  };

  const connectWallet = async (type: 'metamask' | 'trust') => {
    setConnecting(true);
    setError(null);
    setMessage(null);
    try {
      const address =
        type === 'metamask'
          ? await walletService.connectMetaMask()
          : await walletService.connectTrustWallet();

      setWalletAddress(address);
      await syncWallet(address, chain);
    } catch (err: any) {
      setError(err.message || 'Wallet connection failed');
      setWalletAddress(null);
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchPortfolio(walletAddress, chain);
    }
  }, [chain]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center px-6 py-12 text-white font-sans">
      <section className="bg-gray-800 bg-opacity-80 rounded-xl shadow-xl max-w-md w-full p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center tracking-tight drop-shadow-lg">
          🔐 Connect Your Wallet
        </h1>
        <p className="text-center text-gray-300 mb-8 leading-relaxed">
          Access your portfolio and trading tools by connecting a Web3 wallet.
        </p>

        <label htmlFor="chain-select" className="block mb-2 font-semibold text-gray-200">
          Select Blockchain
        </label>
        <select
          id="chain-select"
          className="w-full mb-6 px-4 py-3 rounded-lg bg-gray-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          value={chain}
          onChange={(e) => setChain(e.target.value)}
        >
          {supportedChains.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.label}
            </option>
          ))}
        </select>

        <div className="flex flex-col sm:flex-row justify-center gap-5 mb-8">
          <button
            onClick={() => connectWallet('metamask')}
            disabled={connecting}
            className="flex items-center justify-center gap-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-md px-6 py-3 hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-2xl">🦊</span>
            {connecting ? 'Connecting...' : 'Connect MetaMask'}
          </button>

          <button
            onClick={() => connectWallet('trust')}
            disabled={connecting}
            className="flex items-center justify-center gap-3 bg-blue-600 font-semibold rounded-lg shadow-md px-6 py-3 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-2xl">🔵</span>
            {connecting ? 'Connecting...' : 'Connect Trust Wallet'}
          </button>
        </div>

        {walletAddress && (
          <p className="text-green-400 font-semibold mb-3 break-all text-center select-text">
            Connected: <code>{walletAddress}</code>
          </p>
        )}

        {balance !== null && (
          <p className="text-center text-lg font-bold text-white mb-3">
            📊 Balance: <span className="text-green-300">${balance.toFixed(2)} USDT</span>
          </p>
        )}

        {message && (
          <p className="text-center text-green-300 font-medium mb-3">{message}</p>
        )}

        {error && (
          <p className="text-center text-red-500 font-semibold mb-3">{error}</p>
        )}

        <p className="text-center text-gray-400 text-sm mt-8 select-none">
          Your wallet stays private — we never store keys.
        </p>
      </section>
    </main>
  );
};

export default WalletConnectPage;
