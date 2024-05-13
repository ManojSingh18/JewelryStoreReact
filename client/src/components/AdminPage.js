import React, { useState } from 'react';
import axios from 'axios';

function Admin() {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImage, setProductImage] = useState('');

    const handleAddProduct = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/api/admin/add-product', {
            name: productName,
            price: productPrice,
            imageUrl: productImage
        })
            .then(() => alert('Product added successfully!'))
            .catch(error => console.error('Error adding product:', error));
    };

    return (
        <div className="container mt-5">
            <h2>Admin Panel</h2>
            <form onSubmit={handleAddProduct}>
                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Product Price</label>
                    <input
                        type="number"
                        className="form-control"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Product Image URL</label>
                    <input
                        type="text"
                        className="form-control"
                        value={productImage}
                        onChange={(e) => setProductImage(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Product</button>
            </form>
        </div>
    );
}

export default Admin;
