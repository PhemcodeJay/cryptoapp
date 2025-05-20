// controllers/authController.js

const authService = require('../services/authService');
const { cookieOptions } = require('../config');

/**
 * Request a nonce message for signing.
 */
exports.requestNonce = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const nonce = await authService.generateNonce(walletAddress);
    res.json({ walletAddress, nonce });
  } catch (err) {
    console.error('Nonce request error:', err.message);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
};

/**
 * Verify signed message and return JWT if valid.
 */
exports.verifySignature = async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
      return res.status(400).json({ error: 'Wallet address and signature are required' });
    }

    const { token, user } = await authService.verifyWalletSignature(walletAddress, signature);

    // Set JWT in a secure HTTP-only cookie
    res.cookie('token', token, cookieOptions);

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Signature verification error:', err.message);
    res.status(401).json({ error: 'Signature verification failed' });
  }
};

/**
 * Clear cookie and log out.
 */
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
