import React, { useState } from 'react';
import WalletConnectButton from '../components/WalletConnectButton';

export default function RegisterPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleWalletConnect = (address) => {
    setWalletAddress(address);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!walletAddress) {
      setError('Please connect your Web3 wallet before registering.');
      return;
    }

    if (!email || !password || !confirmPassword) {
      setError('Please fill all form fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // TODO: Submit registration data to backend (email, password, walletAddress)
    alert(`Registered with wallet ${walletAddress} and email ${email}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

      <div className="mb-6 text-center">
        <WalletConnectButton onConnect={handleWalletConnect} />
        {walletAddress && (
          <p className="mt-2 text-green-600 text-sm">
            Wallet connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block mb-1 font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-semibold">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-1 font-semibold">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-indigo-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />
        </div>

        {error && <p className="text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
