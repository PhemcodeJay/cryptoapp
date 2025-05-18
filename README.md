# Crypto App This app combines a Web3 wallet tracker and a futures trading bot with full-stack functionality. ## Features - JWT auth with secure cookies - Wallet tracking by address across chains - Binance Futures bot integration - Indicators: MA 20/200, MACD, RSI, Stoch RSI, Volume - Chart display using Chart.js - React frontend with mobile-responsive UI - Environment-based config (.env for staging/production) 
 Web3-enabled portfolio tracker and a manual/auto crypto futures trading bot, using Node.js, Express, Sequelize, MySQL, JWT (with secure cookies), React, and Chart.js.

✅ Project Summary

A full-stack crypto web app that:

• Accepts a wallet address for portfolio analysis.

• Includes a futures trading bot (manual & auto).

• Uses indicators: MA(20/200), MACD, RSI, Stoch RSI, Volume.

• Applies trade logic: 10% stop loss, 50–100% take profit, min 5 USDT per trade.

• Charts portfolio + trading metrics with timeframe options.

• Has auth system with secure JWT cookies.

• React frontend with Chart.js visualizations.

🧠 Key Features

🔐 Authentication

• JWT auth stored in secure HTTP-only cookies.

• POST /api/auth/login, POST /api/auth/register, GET /api/auth/me

💼 Wallet Analysis

• User inputs wallet address.

• GET /api/wallet/:address fetches token balances.

• GET /api/wallet/:address/history fetches PNL/trade history.

🤖 Trading Bot Engine

• Auto/manual toggle for bot.

• Bot logic in botEngine.js with:

• Entry using indicators (MA, MACD, RSI, Stoch RSI, Vol).

• Risk management: stop loss 10%, take profit 50–100%.

• Trade only if ≥ 5 USDT allocation.

• POST /api/bot/start, POST /api/bot/manual-trade, GET /api/bot/status

📈 Portfolio + Bot Charts

• Chart.js candlestick and line charts for:

• Token performance

• Trade PNLs

• Indicator overlays

• Multi-timeframe support (1h, 4h, 1d)

📦 Tech Stack

• Backend: Node.js, Express, Sequelize ORM, MySQL

• Frontend: React, Chart.js, Axios

• Security: JWT in HTTP-only cookies

• Indicators: MA(20/200), MACD, RSI, Stoch RSI, Volume

• Web3: Read-only wallet support (Etherscan, Moralis, or custom API)

# 🚀 Docker Deployment for Crypto App ## 📦 Prerequisites - VPS with Docker and Docker Compose - Domain & DNS pointed (optional) ## 🔧 Setup ```bash git clone https://github.com/youruser/crypto-app.git cd crypto-app docker compose up -d --build 

🛠️ Services

• frontend: React app on port 3000

• backend: Node.js API on port 4000

• mysql: MySQL 8 DB on port 3306

📝 Notes

• Update .env.production for secure credentials

• Secure with HTTPS (e.g., Nginx + Certbot or Cloudflare)

yaml

Copy code

--- ### ✅ Next Steps Once these files are in place: 1. SSH into your VPS. 2. Install Docker + Docker Compose. 3. Navigate to your project folder. 4. Run: `docker compose up -d --build` 5. App will be live at: - Frontend: `http://your-vps-ip:3000` - Backend API: `http://your-vps-ip:4000/api` --- Would you like the **Nginx reverse proxy + HTTPS (Let’s Encrypt)**