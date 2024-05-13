import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Register.css';  

function Register({ onRegister }) {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: ''
});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setUserData({...userData, [name]: value});
      // Clear errors when user starts correcting them
      if (errors[name]) {
          setErrors({...errors, [name]: null});
      }
  };

    const handleRegister = async (e) => {
        e.preventDefault();
        let tempErrors = {};
         // Basic validation
         if (!userData.username) tempErrors.username = "Username is required";
         if (!userData.email) {
             tempErrors.email = "Email is required";
         } else if (!userData.email.includes('@')) {
             tempErrors.email = "Please enter a valid email address.";
         }
         if (!userData.password) {
             tempErrors.password = "Password is required";
         } else if (userData.password.length < 6) {
             tempErrors.password = "Password must be at least 6 characters long.";
         }
 
         if (Object.keys(tempErrors).length > 0) {
             setErrors(tempErrors);
             Object.values(tempErrors).forEach(error => {
                 toast.error(error);
             });
             return;
         }
 
         try {
          const response = await axios.post('http://localhost:3001/api/users/register', userData);
          toast.success('Registration successful!');
          navigate('/');
      } catch (error) {
          console.error('Registration failed:', error);
          toast.error('Registration failed. Please try again.');
      }
  };

  return (
    <div className="register-container">
        <h1 className='register-header'>Register</h1>
        <div className='card'>
            <form onSubmit={handleRegister}>
                {['username', 'email', 'password'].map(field => (
                    <div className={`form-group ${errors[field] ? 'error' : ''}`} key={field}>
                        <label className='labelNames' htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                            type={field === 'password' ? 'password' : 'text'}
                            className="form-control"
                            id={field}
                            name={field}
                            value={userData[field]}
                            onChange={handleInputChange}
                        />
                    </div>
                ))}
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            <p className="mt-3">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
        <ToastContainer position="top-center" autoClose={5000} hideProgressBar style={{ marginTop: '50px' }} />
    </div>
);

}

export default Register;
