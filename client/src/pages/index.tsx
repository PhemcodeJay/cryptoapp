import React from 'react';
import { Link } from 'react-router-dom';

const NavigationButtons = () => (
  <div className="flex flex-wrap justify-center gap-4 mb-10">
    <Link to="/wallet-connect" className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-xl shadow transition duration-200">
      🔐 Connect Wallet
    </Link>
    <Link to="/dashboard" className="bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-200">
      📊 View Dashboard
    </Link>
    <Link to="/trading-bot" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-200">
      🤖 Trading Bot
    </Link>
    <Link to="/assets-analysis" className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-200">
      📈 Assets Analysis
    </Link>
    <Link to="/logout" className="bg-red-500 hover:bg-red-400 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-200">
      🚪 Logout
    </Link>
  </div>
);

const HeroSection = () => (
  <section className="hero-area relative py-20 text-center text-white bg-gradient-to-r from-gray-900 to-black">
    {/* Background shape with absolute path */}
    <img
      className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
      src="/assets/images/hero/hero-shape.svg"
      alt="Background Shape"
    />
    <div className="container mx-auto relative z-10">
      <h4 className="text-xl mb-4">Start Investing & Earn Money</h4>
      <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
        Say goodbye to <br />
        idle{' '}
        <span className="inline-flex items-center">
          <img
            className="inline w-6 h-6 mx-1"
            src="/assets/images/hero/text-shape.svg"
            alt="text-shape"
          />
          money.
        </span>
      </h1>
      <p className="max-w-xl mx-auto mb-6">
        Invest your spare change in Bitcoin and save with crypto to earn interest in real time.
      </p>
      <Link
        to="/about-us"
        className="btn bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl shadow"
      >
        Discover More
      </Link>
    </div>
  </section>
);

const Features = () => {
  const features = [
    { icon: 'feature-icon-1.png', title: 'Instant Exchange' },
    { icon: 'feature-icon-2.png', title: 'Safe & Secure' },
    { icon: 'feature-icon-3.png', title: 'Instant Trading' },
  ];

  return (
    <section className="feature section py-20 bg-white text-gray-800">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-lg text-indigo-600 mb-2">Why choose us</h3>
          <h2 className="text-3xl font-bold mb-4">Our Features</h2>
          <p className="text-gray-600">
            There are many variations of passages of Lorem Ipsum available, but the majority have
            suffered alteration.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon, title }) => (
            <div
              key={title}
              className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={`/assets/images/features/${icon}`}
                alt={title}
                className="mb-4 w-16 h-16"
              />
              <h4 className="text-xl font-semibold mb-2">{title}</h4>
              <p>
                Invest in Bitcoin on the regular or save with one of the highest interest rates on
                the market.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CallToAction = () => (
  <section className="call-action py-16 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-center">
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold">
        You're using the free <br />
        <span className="text-yellow-300">Lite version of CryptoPilot</span>
      </h2>
      <p className="mt-4">Purchase the full version to get all features and commercial license.</p>
      <div className="mt-6">
        <a
          href="#"
          className="btn bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-xl"
        >
          Buy Pro Version
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer section bg-gray-900 text-white py-12">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <img
          src="/assets/images/logo/white-logo.svg"
          alt="Logo"
          className="mb-4"
        />
        <p>Making the world a better place through constructing elegant hierarchies.</p>
        <div className="mt-4 flex gap-3">
          {[
            'facebook-filled',
            'instagram',
            'twitter-original',
            'linkedin-original',
            'pinterest',
            'youtube',
          ].map((name) => (
            <a key={name} href="#">
              <i className={`lni lni-${name}`} />
            </a>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-3">Solutions</h3>
        <ul>
          {['Marketing', 'Analytics', 'Commerce', 'Insights'].map((link) => (
            <li key={link}>
              <a href="#" className="hover:underline">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-3">Support</h3>
        <ul>
          {['Pricing', 'Documentation', 'Guides', 'API Status'].map((link) => (
            <li key={link}>
              <a href="#" className="hover:underline">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-3">Subscribe</h3>
        <p>Subscribe to our newsletter for the latest updates</p>
        <form className="mt-4 flex">
          <input
            type="email"
            placeholder="Email address"
            className="p-2 rounded-l bg-white text-black flex-1"
          />
          <button type="submit" className="p-2 bg-yellow-400 rounded-r">
            <i className="lni lni-envelope" />
          </button>
        </form>
      </div>
    </div>
    <div className="text-center mt-10 text-sm border-t border-gray-700 pt-4">
      <p>
        © 2023 CryptoPilot - All Rights Reserved. Designed by{' '}
        <a href="https://uideck.com/" className="text-indigo-300 hover:underline">
          UIdeck
        </a>
      </p>
    </div>
  </footer>
);

const IndexPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />
      <NavigationButtons />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default IndexPage;
