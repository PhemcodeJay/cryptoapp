import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session/cookies/token here
    console.log('Logging out...');
    navigate('/wallet-connect');
  }, [navigate]);

  return (
    <div className="p-8">
      <h1 className="text-xl">Logging out...</h1>
    </div>
  );
};

export default LogoutPage;
