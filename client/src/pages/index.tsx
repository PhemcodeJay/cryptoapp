import React from 'react';
import { Link } from 'react-router-dom';

const IndexPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to CryptoPilot</h1>
      <p className="text-lg text-gray-600 mb-8">Track your crypto, trade smart, and stay in control.</p>
      <div className="space-x-4">
        <Link
          to="/wallet-connect"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Connect Wallet
        </Link>
        <Link
          to="/dashboard"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default IndexPage;
