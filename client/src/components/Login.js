// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import '../Login.css'; // Make sure this CSS file is correctly linked

// function Login({ onLogin }) {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();

//         if (!email || !password) {
//             toast.error("All fields are required!");
//             return;
//         }

//         try {
//             const response = await axios.post('http://localhost:3001/api/users/login', {
//                 email,
//                 password,
//             }, { withCredentials: true });
//             console.log("User Logged in", response);
//             navigate('/');
//         } catch (error) {
//             console.error('Login Error:', error);
//             toast.error('Invalid email or password.');
//         }
//     };

//     return (
//         <div className="login-container">
//             <h1>Login</h1>
//             <form onSubmit={handleLogin}>
//                 <div className="form-group">
//                     <label htmlFor="email">Email</label>
//                     <input
//                         type="email"
//                         className="form-control"
//                         id="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="password">Password</label>
//                     <input
//                         type="password"
//                         className="form-control"
//                         id="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                 </div>
//                 <button type="submit" className="btn btn-primary">Login</button>
//             </form>
//             <p className="mt-3">
//                 Don't have an account? <Link to="/register">Register</Link>
//             </p>
//             <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
//         </div>
//     );
// }

// export default Login;
import React, {useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { UserContext } from '../contexts/UserContext'; // Corrected import
import '../Login.css'; // Make sure this CSS file is correctly linked

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { user,setUser } = useContext(UserContext); // Corrected use of context via custom hook
    const [, forceUpdate] = useState();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("All fields are required!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/users/login', {
                email,
                password,
            }, { withCredentials: true });
            if (response.data) {
                console.log("Setting user:", response.data);
                setUser(response.data);
                console.log("User set in Login component:", response.data);
                // forceUpdate({}); // empty object to change the state
                navigate('/');

            } else {
                throw new Error('Failed to login');
            }
        } catch (error) {
            console.error('Login Error:', error);
            toast.error('Invalid email or password.');
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <p className="mt-3">
                Don't have an account? <Link to="/register">Register</Link>
            </p>
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
        </div>
    );
}

export default Login;
