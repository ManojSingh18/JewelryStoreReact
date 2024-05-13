const express = require('express');
const router = express.Router();
const connection = require('../db'); // Import the MySQL connection

router.post('/', (req, res) => {
    const { address, paymentInfo } = req.body;
    const userEmail = req.session.user?.email; // Retrieve email from session

    if (!userEmail) {
        return res.status(401).send('User not logged in.');
    }

    // Insert or process payment and shipping information here
    console.log(`Processing order for: ${userEmail}, Shipping Address: ${address}, Payment Info: ${paymentInfo}`);

    // Clear the cart after the checkout process
    const clearCartQuery = 'DELETE FROM cart WHERE user_email = ?';
    connection.query(clearCartQuery, [userEmail], (error) => {
        if (error) {
            console.error('Database Error:', error);
            return res.status(500).send('Internal Server Error.');
        }

        res.status(200).send('Order placed successfully and cart cleared.');
    });
});

module.exports = router;
