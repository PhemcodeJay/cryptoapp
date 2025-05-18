import React, { useEffect, useState } from 'react';
import walletService from '../services/walletService';

export default function PortfolioPage() {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    walletService.getWallets().then(setWallets);
  }, []);

  return (
    <div>
      <h2>Wallets</h2>
      <ul>
        {wallets.map(wallet => (
          <li key={wallet.id}>{wallet.address} ({wallet.chain})</li>
        ))}
      </ul>
    </div>
  );
}
