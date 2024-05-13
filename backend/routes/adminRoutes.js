const express = require('express');
const router = express.Router();
const connection = require('../db');

// Middleware to check for admin role
function checkAdmin(req, res, next) {
    const userEmail = req.session.user?.email;

    const query = 'SELECT role FROM users WHERE email = ?';
    connection.query(query, [userEmail], (error, results) => {
        if (error || results.length === 0 || results[0].role !== 'admin') {
            return res.status(403).send('Access denied. Admins only.');
        }
        next();
    });
}

// Admin route to add a new product
router.post('/add-product', checkAdmin, (req, res) => {
    const { name, price, imageUrl } = req.body;

    const query = 'INSERT INTO products (name, price, imageUrl) VALUES (?, ?, ?)';
    connection.query(query, [name, price, imageUrl], (error) => {
        if (error) {
            console.error('Database Error:', error);
            return res.status(500).send('Internal Server Error.');
        }
        res.status(200).send('Product added successfully.');
    });
});

module.exports = router;
