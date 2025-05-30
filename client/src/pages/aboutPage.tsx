import React from "react";

const About: React.FC = () => {
  return (
    <>
      {/* About Section */}
      <section className="about_section layout_padding">
        <div className="container">
          <div className="heading_container">
            <h2>About Cryptop</h2>
          </div>
          <div className="box d-flex flex-wrap align-items-center">
            <div className="img-box" style={{ flex: "1 1 300px", maxWidth: 400 }}>
              <img src="images/about-img.png" alt="About Cryptop" className="img-fluid" />
            </div>
            <div className="detail-box" style={{ flex: "1 1 300px", paddingLeft: 20 }}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniamLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              </p>
              <div className="btn-box">
                <a href="#" className="btn btn-primary">Read More</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bootstrap Cards Section */}
      <section className="container my-5">
        <div className="row">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="col-sm-6 col-lg-3 mb-4">
              <div className="card h-100">
                <img
                  src={`https://via.placeholder.com/300x200?text=Image+${num}`}
                  className="card-img-top"
                  alt={`Image ${num}`}
                />
                <div className="card-body">
                  <h5 className="card-title">Card title {num}</h5>
                  <p className="card-text">
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                  </p>
                  <a href="#" className="btn btn-primary">
                    Go somewhere
                  </a>
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
