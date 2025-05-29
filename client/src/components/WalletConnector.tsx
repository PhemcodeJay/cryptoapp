import * as React from 'react';
import walletService from '../../services/walletService';

const WalletConnectButton: React.FC = () => {
  const [address, setAddress] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const addr = await walletService.connectMetaMask();
      setAddress(addr);
      console.log('Connected address:', addr);
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      setAddress(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={connectWallet}
        disabled={loading}
        className={`bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Connecting...' : address ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
      {address && (
        <p className="mt-2 text-green-500 break-all">
          Connected: {address}
        </p>
      )}
      {error && (
        <p className="mt-2 text-red-500">
          Error: {error}
        </p>
      )}
    </div>
  );
};

export default WalletConnectButton;
