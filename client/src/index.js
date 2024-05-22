import 'bootstrap/dist/css/bootstrap.min.css'; // Import bootstrap CSS
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext'; // Ensure this import is correct

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <CartProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

if ('serviceWorker' in navigator && !navigator.userAgent.includes('Electron')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      (registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      },
      (err) => {
        console.log('Service Worker registration failed:', err);
      }
    );
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
