import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Checkout.css'; 

function Checkout() {
    const [formData, setFormData] = useState({
        address: '',
        cardType: 'Visa',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async (e) => {
        e.preventDefault();

        // Validation example (add more as needed)
        if (!formData.cardNumber || formData.cardNumber.length < 16) {
            toast.error('Please enter a valid card number.');
            return;
        }

        // Show the processing toast immediately
        toast.info('Processing your order...', { autoClose: 2000 });

        try {
            // Simulate a delay for the API call
            setTimeout(async () => {
                const response = await axios.post('http://localhost:3001/api/checkout', formData, { withCredentials: true });

                if (response.status === 200) {
                    toast.success('Order placed successfully!', {
                        autoClose: 5000,
                        onClose: () => navigate('/cart')
                    });
                } else {
                    throw new Error('Network response was not ok.');
                }
            }, 2000);
        } catch (error) {
            toast.error('Failed to place order. Please check your payment information.', { autoClose: 5000 });
            console.error('Error:', error);
        }
    };

    return (
        <div className="checkout-container">
            <ToastContainer />
            <h2>Checkout</h2>
            <form onSubmit={handleCheckout} className="checkout-form">
                <div className="form-group">
                    <label htmlFor="address">Shipping Address</label>
                    <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cardType">Card Type</label>
                    <select name="cardType" className="form-control" value={formData.cardType} onChange={handleChange}>
                        <option value="Visa">Visa</option>
                        <option value="MasterCard">MasterCard</option>
                        <option value="Amex">American Express</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="cardNumber">Credit Card Number</label>
                    <input
                        type="text"
                        className="form-control"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Expiry Date</label>
                    <div className="expiry-date">
                        <input
                            type="text"
                            className="form-control"
                            name="expiryMonth"
                            placeholder="MM"
                            maxLength="2"
                            value={formData.expiryMonth}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            className="form-control"
                            name="expiryYear"
                            placeholder="YY"
                            maxLength="2"
                            value={formData.expiryYear}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                        type="text"
                        className="form-control"
                        name="cvv"
                        maxLength="3"
                        value={formData.cvv}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit Order</button>
            </form>
        </div>
    );
}

export default Checkout;
