import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext'; // Make sure this import path is correct
import GoldRate from './GoldRates'; 

function HomePage() {
  const { user } = useContext(UserContext);  // Make sure useUser hook is working correctly

  useEffect(() => {
    console.log("User in HomePage updated:", user);
    // Any other logic that needs to run when user updates
  }, [user]);

  console.log("Current user in HomePage:", user);

  return (
      <div className="home-page-container">
          <div className="content-container">
          <h1>Welcome to Our Jewelry Shop{user && user.username ? `, ${user.username}` : ''}</h1>
              <p>Explore our exclusive collection of fine jewelry.</p>
              <GoldRate />
              <Link to="/products" className="btn btn-primary">Shop Now</Link>
              {!user && (
                  <Link to="/login" className="btn btn-secondary">Login</Link>
              )}
          </div>
      </div>
  );
}

export default HomePage;
