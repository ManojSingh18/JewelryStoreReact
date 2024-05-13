// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../HomePage.css';

// function HomePage() {
//   const [username, setUsername] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get('http://localhost:3001/api/users/current', { withCredentials: true })
//       .then(response => {
//         if (response.data.username) {
//           setUsername(response.data.username);
//         }
//       })
//       .catch(error => {
//         console.log('No user session found', error.response?.data?.error || error.message);
//       });
//   }, []);

//   const handleLogout = () => {
//     axios.post('http://localhost:3001/api/users/logout', {}, { withCredentials: true })
//       .then(() => {
//         setUsername('');
//         navigate('/');
//       })
//       .catch(error => {
//         console.error('Logout failed:', error.response?.data || error.message);
//       });
//   };

//   return (
//     <div className="home-page-container">
     
//       <div className="content-container">
//         <h1>Welcome to Our Jewelry Shop{username ? `, ${username}` : ''}</h1>
//         <p>Explore our exclusive collection of fine jewelry.</p>
//         <div className="button-group">
//           <Link to="/products" className="btn btn-primary">Shop Now</Link>
//           {username ? (
//             <>
//               <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
//               <Link to="/profile" className="btn btn-info">Profile</Link>
//             </>
//           ) : (
//             <Link to="/register" className="btn btn-secondary">Register/Login</Link>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HomePage;


// HomePage.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext'; // Make sure this import path is correct

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
              <h1>Welcome to Our Jewelry Shop{user ? `, ${user.username}` : ''}</h1>
              <p>Explore our exclusive collection of fine jewelry.</p>
              <Link to="/products" className="btn btn-primary">Shop Now</Link>
              {!user && (
                  <Link to="/login" className="btn btn-secondary">Login</Link>
              )}
          </div>
      </div>
  );
}

export default HomePage;


