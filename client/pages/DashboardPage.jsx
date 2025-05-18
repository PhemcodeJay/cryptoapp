// DashboardPage.js

import React from 'react';
import WalletConnectButton from '../components/WalletConnectButton';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold">Crypto Dashboard</h1>
                <WalletConnectButton />
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                <div className="bg-white shadow rounded-2xl p-4">Portfolio Overview</div>
                <div className="bg-white shadow rounded-2xl p-4">Trading Bot Status</div>
                <div className="bg-white shadow rounded-2xl p-4">Recent Activity</div>
            </main>
        </div>
    );
}import React from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Portfolio and Bot status here.</p>
    </div>
  );
}
