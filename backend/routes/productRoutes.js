const express = require('express');
const router = express.Router();
const connection = require('../db'); // Import MySQL connection

// Get all products
router.get('/', (req, res) => {
    const query = 'SELECT * FROM products';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Database Error:', error);
            return res.status(500).send('Internal Server Error.');
        }
        res.status(200).json(results);
    });
});

// Get a specific product
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM products WHERE id = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Database Error:', error);
            return res.status(500).send('Internal Server Error.');
        }
        if (results.length === 0) {
            return res.status(404).send('Product not found.');
        }
        res.status(200).json(results[0]);
    });
});

module.exports = router;
