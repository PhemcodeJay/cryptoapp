const { spawn } = require('child_process');
const path = require('path');
const { fetchUsdtBalance } = require('./walletService');

const MIN_TRADE_AMOUNT = 5; // USDT

/**
 * Map timeframe to corresponding Python bot script
 */
const BOT_SCRIPTS = {
  '1h': 'hourly_bot.py',
  '4h': 'hourly_bot.py',
  '1d': 'daily_bot.py',
  '1w': 'weekly_bot.py',
};

/**
 * Spawns a Python bot based on timeframe
 */
function runPythonBot({ strategy, timeframe, balanceToUse, walletAddress, signature, threshold }) {
  return new Promise((resolve, reject) => {
    const botFile = BOT_SCRIPTS[timeframe];
    if (!botFile) return reject(new Error(`No bot found for timeframe: ${timeframe}`));

    const scriptPath = path.join(__dirname, '../bot', botFile);
    const args = [
      '--strategy', strategy,
      '--timeframe', timeframe,
      '--balance', balanceToUse,
      '--wallet', walletAddress,
      '--signature', signature,
      '--threshold', threshold
    ];

    const bot = spawn('python3', [scriptPath, ...args]);

    let output = '';
    bot.stdout.on('data', data => output += data.toString());
    bot.stderr.on('data', data => console.error('Bot Error:', data.toString()));

    bot.on('close', code => {
      if (code === 0) {
        resolve({ message: 'Bot executed successfully', output });
      } else {
        reject(new Error(`Bot exited with code ${code}`));
      }
    });
  });
}

/**
 * Executes a trade by launching the relevant bot
 */
async function executeTrade(config) {
  const {
    strategy,
    timeframe,
    threshold,
    balanceToUse,
    walletAddress,
    chain = 'eth',
    signature,
  } = config;

  if (balanceToUse < MIN_TRADE_AMOUNT) {
    throw new Error(`Minimum trade amount is ${MIN_TRADE_AMOUNT} USDT.`);
  }

  const balanceData = await fetchUsdtBalance(walletAddress, chain);
  const availableBalance = balanceData?.balance ?? 0;

  if (availableBalance < balanceToUse) {
    throw new Error(`Insufficient USDT balance: ${availableBalance} < ${balanceToUse}`);
  }

  try {
    const result = await runPythonBot({
      strategy,
      timeframe,
      balanceToUse,
      walletAddress,
      signature,
      threshold,
    });

    return result;
  } catch (error) {
    console.error('Bot execution error:', error.message);
    throw new Error('Failed to execute Python trading bot.');
  }
}

module.exports = {
  executeTrade,
};
