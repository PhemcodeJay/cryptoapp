import React from 'react';
import { Link } from 'react-router-dom';

const NavigationButtons: React.FC = () => (
  <div className="flex flex-wrap justify-center gap-4 mb-10">
    <Link
      to="/wallet-connect"
      className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-xl shadow transition duration-200"
    >
      🔐 Connect Wallet
    </Link>
    <Link
      to="/portfolio"
      className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-200"
    >
      📊 Portfolio Overview
    </Link>
    <Link
      to="/asset-analysis"
      className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-200"
    >
      📈 Asset Analysis
    </Link>
    <Link
      to="/trading-bot"
      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-200"
    >
      🤖 Trading Bot
    </Link>
    <Link
      to="/about"
      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-200"
    >
      🤖 About
    </Link>
    <Link
      to="/logout"
      className="bg-red-500 hover:bg-red-400 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-200"
    >
      🚪 Logout
    </Link>
  </div>
);

const HeroSection: React.FC = () => (
  <section className="relative py-24 bg-gradient-to-r from-indigo-900 to-blue-900 text-white text-center">
    <div className="container mx-auto relative z-10 px-6">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
        CryptoPilot <br />
        <span className="text-yellow-400">Automated Web3 Wallet Connect, Asset Analysis, and Trading</span>
      </h1>
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
        Your Web3 Wallet <br />
        <span className="text-yellow-400">Portfolio & Trading Hub</span>
      </h1>
      <p className="max-w-3xl mx-auto text-lg md:text-xl mb-8">
        Connect your Web3 wallet to track your assets in real-time, perform in-depth market analysis,
        and automate trades with our advanced trading bot running on Hyperliquid — optimized hourly, daily, and weekly.
      </p>
    </div>
  </section>
);

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      icon: 'wallet.svg',
      title: 'Secure Web3 Wallet Integration',
      description:
        'Easily connect your Ethereum and other Web3 wallets with robust security and full privacy controls.',
    },
    {
      icon: 'analytics.svg',
      title: 'Advanced Asset Analysis',
      description:
        'Gain detailed insights on your holdings with real-time and historical performance charts, updated hourly, daily, and weekly.',
    },
    {
      icon: 'bot.svg',
      title: 'Automated Trading Bot',
      description:
        'Configure your trading strategies and let our bot execute trades 24/7 on Hyperliquid with precision and speed.',
    },
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map(({ icon, title, description }) => (
            <div
              key={title}
              className="bg-gray-800 rounded-xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition"
            >
              <img
                src={`/assets/icons/${icon}`}
                alt={title}
                className="w-20 h-20 mb-6"
                loading="lazy"
              />
              <h3 className="text-2xl font-semibold mb-4">{title}</h3>
              <p className="text-gray-300">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface BotSchedule {
  title: string;
  description: string;
  icon: string;
}

const TradingBotSchedule: React.FC = () => {
  const schedules: BotSchedule[] = [
    {
      title: 'Hourly',
      description:
        'Quick reactions to market changes using optimized scalping and momentum strategies.',
      icon: 'hourly.svg',
    },
    {
      title: 'Daily',
      description:
        'Comprehensive analysis of daily market trends to execute balanced trading plans with risk management.',
      icon: 'daily.svg',
    },
    {
      title: 'Weekly',
      description:
        'Long-term portfolio adjustments and trend following based on weekly aggregated data.',
      icon: 'weekly.svg',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-800 to-indigo-900 text-white text-center">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-4xl font-bold mb-8">Trading Bot Schedule</h2>
        <p className="mb-12 text-lg max-w-3xl mx-auto">
          Our Hyperliquid-powered trading bot operates at multiple intervals to maximize your gains:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {schedules.map(({ title, description, icon }) => (
            <div
              key={title}
              className="bg-indigo-700 rounded-lg p-6 shadow-lg hover:shadow-2xl transition"
            >
              <img
                src={`/assets/icons/${icon}`}
                alt={title}
                className="w-16 h-16 mx-auto mb-4"
                loading="lazy"
              />
              <h3 className="text-2xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-200">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <h3 className="text-white text-xl font-bold mb-4">CryptoPilot</h3>
        <p>
          Empowering Web3 users with portfolio insights, asset analysis, and automated trading on
          Hyperliquid.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
        <ul>
          {[
            { label: 'Connect Wallet', path: '/wallet-connect' },
            { label: 'Portfolio', path: '/portfolio' },
            { label: 'Asset Analysis', path: '/asset-analysis' },
            { label: 'Trading Bot', path: '/trading-bot' },
          ].map(({ label, path }) => (
            <li key={path}>
              <Link to={path} className="hover:text-white">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Contact</h4>
        <p>Email: support@cryptopilot.io</p>
        <p>Twitter: @CryptoPilot</p>
        <p>Discord: CryptoPilot#1234</p>
      </div>
    </div>
    <div className="text-center mt-12 text-sm text-gray-600">
      © 2025 CryptoPilot. All rights reserved.
    </div>
  </footer>
);

const IndexPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      <HeroSection />
      <NavigationButtons />
      <Features />
      <TradingBotSchedule />
      <Footer />
    </div>
  );
};

export default IndexPage;
