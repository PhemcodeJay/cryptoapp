import React, { useState } from 'react';
import { ethers } from 'ethers';

export default function WalletConnectButton({ onConnect }) {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = ethers.utils.getAddress(accounts[0]);
        setWalletAddress(address);
        if (onConnect) onConnect(address);
      } catch (err) {
        alert('Wallet connection rejected.');
      }
    } else {
      alert('Please install MetaMask or another Ethereum wallet extension.');
    }
  };

  return (
    <button
      onClick={connectWallet}
      className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
    >
      {walletAddress
        ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : 'Connect Wallet'}
    </button>
  );
}
