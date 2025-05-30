import React from "react";

const About: React.FC = () => {
  return (
    <>
      {/* About Section */}
      <section className="about_section layout_padding">
        <div className="container">
          <div className="heading_container">
            <h2>About Cryptopilot</h2>
          </div>
          <div className="box d-flex flex-wrap align-items-center">
            <div
              className="img-box"
              style={{ flex: "1 1 300px", maxWidth: 400 }}
            >
              <img
                src="images/about-img.png"
                alt="About Cryptopilot"
                className="img-fluid"
              />
            </div>
            <div
              className="detail-box"
              style={{ flex: "1 1 300px", paddingLeft: 20 }}
            >
              <p>
                Cryptopilot is an advanced crypto asset analytics platform that
                leverages real-time wallet connect data to provide actionable
                insights. Our platform monitors blockchain assets dynamically,
                enabling you to track your portfolio with precision and up-to-the-minute
                accuracy.
              </p>
              <p>
                Beyond analytics, Cryptopilot features an intelligent auto trading
                bot capable of executing trades on hourly, daily, and weekly
                intervals based on market signals and your custom strategies.
                This automation helps maximize your returns while minimizing
                manual oversight.
              </p>
              <p>
                Experience seamless integration, real-time asset tracking, and
                smart automated trading all in one powerful, user-friendly
                platform.
              </p>
              <div className="btn-box">
                <a href="#" className="btn btn-primary">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container my-5">
        <div className="row">
          {[
            {
              title: "Real-Time Wallet Connect",
              description:
                "Connect your wallets securely and get instant asset updates with live blockchain data streaming.",
              imgAlt: "Wallet Connect",
              imgSrc: "images/wallet-connect.png",
            },
            {
              title: "Asset Analysis",
              description:
                "Gain deep insights into your crypto holdings with advanced analytics, historical trends, and risk assessments.",
              imgAlt: "Asset Analysis",
              imgSrc: "images/asset-analysis.png",
            },
            {
              title: "Auto Trading Bot",
              description:
                "Automate your trading strategies with our smart bot that executes trades on your preferred hourly, daily, or weekly schedules.",
              imgAlt: "Auto Trading Bot",
              imgSrc: "images/auto-trading.png",
            },
            {
              title: "Customizable Alerts",
              description:
                "Stay ahead with personalized notifications on market movements and portfolio changes.",
              imgAlt: "Alerts",
              imgSrc: "images/alerts.png",
            },
          ].map(({ title, description, imgAlt, imgSrc }, index) => (
            <div key={index} className="col-sm-6 col-lg-3 mb-4">
              <div className="card h-100">
                <img src={imgSrc} className="card-img-top" alt={imgAlt} />
                <div className="card-body">
                  <h5 className="card-title">{title}</h5>
                  <p className="card-text">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;
