import React, { useContext, useEffect, useState } from 'react';
import { Link, Routes, Route} from 'react-router-dom';
import axios from 'axios';
import Admin from './components/AdminPage';
import HomePage from './components/HomePage';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/UserProfiles'; // Adjust the path as necessary
// import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './HomePage.css';
// import React, { useEffect, useState } from 'react';
// import { Link, Routes, Route } from 'react-router-dom';
// import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { UserContext } from './contexts/UserContext';

function App() {
    // const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    // const navigate = useNavigate();
    // const [, forceUpdate] = useState();
    const { user, setUser } = useContext(UserContext);


    useEffect(() => {
        console.log("Detected user change:", user);
    }, [user]); // This will log whenever the user changes, helping to debug.


    useEffect(() => {
        let isMounted = true; // Flag to check if component is mounted
        axios.get('http://localhost:3001/api/users/profile', { withCredentials: true })
            .then(response => {
                if (isMounted) {
                    setUser(response.data);
                    setIsAdmin(response.data.role === 'admin');
                }
            })
            .catch(error => console.error('Error fetching user data:', error));
    
        return () => { isMounted = false; }; // Cleanup function to set isMounted to false
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

    

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3001/api/users/logout', {}, { withCredentials: true });
            setUser(null);
            console.log("User logged out.");
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div>
            <header className="header">
                <nav className="navbar">
                    <Link to="/" className="navbar-brand">Jewelry Shop</Link>
                    <div className="navbar-links">
                        <Link to="/products">Products</Link>
                        <Link to="/cart">Cart</Link>
                        {user && (
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    <FontAwesomeIcon icon={faUserCircle} /> {user.username}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className='dropDownContents'>
                                    <Dropdown.Item  as={Link} to="/profile">Profile</Dropdown.Item>
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                        {isAdmin && <Link to="/admin">Admin Panel</Link>}
                    </div>
                </nav>
            </header>

            <Routes>
                <Route path="/" element={<HomePage key={user ? user.id : 'logged-out'} />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                {isAdmin && <Route path="/admin" element={<Admin />} />}
            </Routes>
        </div>
    );
}

export default App;
