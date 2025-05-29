import React, { useState } from 'react';
import walletService from '../../services/walletService'; // ✅ Corrected path


const WalletConnectPage: React.FC = () => {
  const [connecting, setConnecting] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnectMetaMask = async () => {
    setConnecting(true);
    setError(null);
    try {
      const address = await walletService.connectMetaMask();
      setWalletAddress(address);
    } catch (err: any) {
      setError(err.message || 'Failed to connect MetaMask');
      setWalletAddress(null);
    } finally {
      setConnecting(false);
    }
  };

  const handleConnectTrustWallet = async () => {
    setConnecting(true);
    setError(null);
    try {
      const address = await walletService.connectTrustWallet();
      setWalletAddress(address);
    } catch (err: any) {
      setError(err.message || 'Failed to connect Trust Wallet');
      setWalletAddress(null);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-800 via-purple-700 to-pink-600 text-white px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-4">🔐 Connect Your Wallet</h1>
      <p className="text-lg text-center max-w-xl mb-8 opacity-90">
        To access your portfolio and use the trading bot, please connect a supported Web3 wallet.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={handleConnectMetaMask}
          disabled={connecting}
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-300 transition disabled:opacity-50"
        >
          🦊 {connecting ? 'Connecting...' : 'Connect MetaMask'}
        </button>

        <button
          onClick={handleConnectTrustWallet}
          disabled={connecting}
          className="px-6 py-3 bg-blue-500 font-semibold rounded-lg shadow hover:bg-blue-400 transition disabled:opacity-50"
        >
          🔵 {connecting ? 'Connecting...' : 'Connect Trust Wallet'}
        </button>
      </div>

      {walletAddress && (
        <p className="mt-6 text-green-400 font-semibold">
          Connected wallet: <code>{walletAddress}</code>
        </p>
      )}

      {error && (
        <p className="mt-6 text-red-500 font-semibold">
          Error: {error}
        </p>
      )}

      <p className="mt-10 text-sm text-white text-opacity-80">
        Your wallet remains in your control — we never store private keys.
      </p>
    </div>
  );
};

export default WalletConnectPage;
