import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../ProductDetails.css';

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/products/${id}`, { withCredentials: true })
            .then(response => setProduct(response.data))
            .catch(error => console.error('Error:', error));

        axios.get(`http://localhost:3001/api/cart`, { withCredentials: true })
            .then(response => {
                const productInCart = response.data.some(item => item.product_id === parseInt(id));
                setInCart(productInCart);
            })
            .catch(error => console.error('Error checking cart:', error));
    }, [id]);

    const handleAddMore = () => {
        axios.post('http://localhost:3001/api/cart/add', { productId: id }, { withCredentials: true })
            .then(() => {
                toast.success('Product added or quantity increased!');
                axios.get('http://localhost:3001/api/cart', { withCredentials: true })
                    .then(response => {
                        const productInCart = response.data.some(item => item.product_id === parseInt(id));
                        setInCart(productInCart);
                    })
                    .catch(error => console.error('Error checking cart after adding:', error));
            })
            .catch(error => {
                // If unauthorized, show the login/register toast notification
                if (error.response && error.response.status === 401) {
                    toast.error(<div>Please <Link to="/login">log in</Link> or <Link to="/register">register</Link> to continue.</div>);
                } else {
                    console.error('Error adding items:', error);
                    toast.error('Failed to add item to cart!');
                }
            });
    };

    const handleGoToCart = () => navigate('/cart');

    return (
        <div className="product-details-container">
            <div className="card">
                <img src={product.image} className="card-img-top" alt={product.name} />
                <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">${product.price}</p>
                    {inCart ? (
                        <>
                            <button className="btn btn-primary mr-2" onClick={handleAddMore}>Add More</button>
                            <button className="btn btn-secondary" onClick={handleGoToCart}>Go to Cart</button>
                        </>
                    ) : (
                        <button className="btn btn-primary" onClick={handleAddMore}>Add to Cart</button>
                    )}
                </div>
            </div>
            {/* Toast notifications */}
            <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar />
        </div>
    );
}

export default ProductDetails;
