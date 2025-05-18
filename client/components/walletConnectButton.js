// WalletConnectButton.js

import React, { useState } from 'react';
import { ethers } from 'ethers';

export default function WalletConnectButton({ onConnect }) {
    const [walletAddress, setWalletAddress] = useState('');

    const connectWallet = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const address = ethers.utils.getAddress(accounts[0]);
            setWalletAddress(address);
            if (onConnect) onConnect(address);
        } else {
            alert('Install MetaMask to connect your wallet.');
        }
    };

    return (
        <button onClick={connectWallet} className="bg-blue-600 text-white px-4 py-2 rounded-xl">
            {walletAddress
                ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : 'Connect Wallet'}
        </button>
    );
}
