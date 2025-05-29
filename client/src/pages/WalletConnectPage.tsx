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
      setMessage(response.message || 'Wallet synced!');
      await fetchPortfolio(address, selectedChain);
    } catch (err: any) {
      console.error('Sync error:', err);
      setError(err.message || 'Sync failed');
    }
  };

  const fetchPortfolio = async (address: string, selectedChain: string) => {
    try {
      const response = await walletService.getPortfolio(address, selectedChain);
      setBalance(response.balance || 0);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-800 via-purple-700 to-pink-600 text-white px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-4">🔐 Connect Your Wallet</h1>
      <p className="text-lg text-center max-w-xl mb-6 opacity-90">
        Access your portfolio and trading tools by connecting a Web3 wallet.
      </p>

      <div className="mb-6">
        <label className="block mb-1 text-sm">Select Blockchain</label>
        <select
          className="px-4 py-2 rounded text-black font-medium"
          value={chain}
          onChange={(e) => setChain(e.target.value)}
        >
          {supportedChains.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        <button
          onClick={() => connectWallet('metamask')}
          disabled={connecting}
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-300 transition disabled:opacity-50"
        >
          🦊 {connecting ? 'Connecting...' : 'Connect MetaMask'}
        </button>

        <button
          onClick={() => connectWallet('trust')}
          disabled={connecting}
          className="px-6 py-3 bg-blue-500 font-semibold rounded-lg shadow hover:bg-blue-400 transition disabled:opacity-50"
        >
          🔵 {connecting ? 'Connecting...' : 'Connect Trust Wallet'}
        </button>
      </div>

      {walletAddress && (
        <p className="mt-4 text-green-400 font-semibold">
          Connected: <code>{walletAddress}</code>
        </p>
      )}

      {balance !== null && (
        <p className="mt-2 text-lg font-bold text-white">
          📊 Balance: <span className="text-green-300">${balance.toFixed(2)} USDT</span>
        </p>
      )}

      {message && (
        <p className="mt-4 text-green-300">{message}</p>
      )}

      {error && (
        <p className="mt-4 text-red-500 font-semibold">Error: {error}</p>
      )}

      <p className="mt-10 text-sm text-white text-opacity-80">
        Your wallet stays private — we never store keys.
      </p>
    </div>
  );
};

export default WalletConnectPage;
