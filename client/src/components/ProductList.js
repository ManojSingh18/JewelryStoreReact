import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../ProductList.css';

function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Ensure this matches your backend route
        axios.get('http://localhost:3001/api/products', { withCredentials: true })
            .then(response => 
                
                    setProducts(response.data)
                  
                )
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="product-list-container">
            <h2>Our Products</h2>
            <div className="product-row">
                {products.map(product => {
                    // Prepend the server base URL to the relative image URL
                    const imageUrl = `http://localhost:3001${product.imageUrl}`;

                    return (
                        <div className="product-card" key={product.id}>
                            <img src={imageUrl} className="product-image" alt={product.name} />
                            <h5>{product.name}</h5>
                            <p>${product.price}</p>
                            <Link to={`/product/${product.id}`} className="btn btn-primary">View Details</Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ProductList;
