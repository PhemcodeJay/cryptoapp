const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

exports.generateNonce = async (walletAddress) => {
  const normalizedAddress = walletAddress.toLowerCase();
  const nonce = `Login to SalesPilot with wallet ${walletAddress} at ${Date.now()}`;

  // Find or create user with this wallet address
  const [user, created] = await User.findOrCreate({
    where: { walletAddress: normalizedAddress },
    defaults: {
      status: 'pending',
      role: 'user',
      nonce,
    }
  });

  // If user already exists, update the nonce
  if (!created) {
    user.nonce = nonce;
    await user.save();
  }

  return nonce;
};

exports.verifyWalletSignature = async (walletAddress, signature) => {
  const normalizedAddress = walletAddress.toLowerCase();
  const user = await User.findOne({ where: { walletAddress: normalizedAddress } });

  if (!user || !user.nonce) {
    throw new Error('Nonce not found. Please request a new login.');
  }

  let recoveredAddress;
  try {
    recoveredAddress = ethers.utils.verifyMessage(user.nonce, signature).toLowerCase();
  } catch (err) {
    throw new Error('Invalid signature format');
  }

  if (recoveredAddress !== normalizedAddress) {
    throw new Error('Signature mismatch. Unauthorized.');
  }

  // Clear nonce and activate user
  user.nonce = null;
  user.status = 'active';
  await user.save();

  // Prepare JWT payload
  const payload = {
    id: user.id,
    walletAddress: user.walletAddress,
    role: user.role,
  };

  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpires,
  });

  return { token, user: payload };
};
