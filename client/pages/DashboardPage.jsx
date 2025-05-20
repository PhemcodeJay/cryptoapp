import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnectButton from '../components/WalletConnectButton';
import {
  FaWallet,
  FaRobot,
  FaHistory,
  FaChartPie,
  FaCogs,
} from 'react-icons/fa';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Crypto Dashboard</h1>
        <WalletConnectButton />
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Portfolio Overview Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <FaWallet className="text-4xl text-indigo-600" />
            <h2 className="text-xl font-semibold">Portfolio Overview</h2>
          </div>
          <div className="mt-4 text-gray-700">
            <p className="text-3xl font-bold">$12,345.67</p>
            <p className="text-sm text-green-600 mt-1">+8.4% this month</p>
          </div>
          <Link
            to="/portfolio"
            className="mt-6 inline-block text-indigo-700 hover:text-indigo-900 font-semibold"
          >
            View Details &rarr;
          </Link>
        </div>

        {/* Trading Bot Status Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <FaRobot className="text-4xl text-green-600" />
            <h2 className="text-xl font-semibold">Trading Bot Status</h2>
          </div>
          <div className="mt-4 text-gray-700">
            <p className="text-lg font-semibold">Active</p>
            <p className="text-sm text-gray-500 mt-1">Running since 3 days</p>
          </div>
          <Link
            to="/bot-config"
            className="mt-6 inline-block text-green-700 hover:text-green-900 font-semibold"
          >
            Configure Bot &rarr;
          </Link>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <FaHistory className="text-4xl text-yellow-600" />
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          <ul className="mt-4 text-gray-700 list-disc list-inside space-y-1 max-h-40 overflow-y-auto">
            <li>Bought 0.5 ETH at $1,200</li>
            <li>Sold 0.1 BTC at $55,000</li>
            <li>Bot executed buy order on SOL</li>
            <li>Portfolio rebalance completed</li>
          </ul>
          <Link
            to="/activity"
            className="mt-6 inline-block text-yellow-700 hover:text-yellow-900 font-semibold"
          >
            View All Activity &rarr;
          </Link>
        </div>
      </main>

      {/* Quick Links */}
      <section className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link
          to="/portfolio"
          className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          View Portfolio
        </Link>
        <Link
          to="/bot-config"
          className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Configure Trading Bot
        </Link>
        <Link
          to="/dashboard"
          className="px-5 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Refresh Dashboard
        </Link>
      </section>
    </div>
  );
}
