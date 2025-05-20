import React from 'react';
import { Link } from 'react-router-dom';

const IndexPage = () => (
  <div className="container text-center mt-5">
    <h1>Web3 Wallet Portfolio Tracker</h1>
    <p className="lead">Track your assets & configure auto/manual trading bots.</p>
    <Link to="/login" className="btn btn-primary m-2">Login</Link>
    <Link to="/register" className="btn btn-outline-secondary m-2">Register</Link>
  </div>
);

export default IndexPage;
