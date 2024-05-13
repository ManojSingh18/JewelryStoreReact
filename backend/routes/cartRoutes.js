const express = require('express');
const router = express.Router();
const connection = require('../db'); // Import MySQL connection

// Add a product to the cart
router.post('/add', (req, res) => {
    const { productId } = req.body;
    const userEmail = req.session.user?.email;

    if (!userEmail) {
        // Send a clear message indicating login is required
        return res.status(401).json({ message: 'User not logged in. Please log in or register to continue.' });
    }

    // Check if the product exists in the products table
    const checkQuery = 'SELECT id FROM products WHERE id = ?';
    connection.query(checkQuery, [productId], (error, results) => {
        if (error || results.length === 0) {
            return res.status(404).send('Product not found.');
        }

        // Insert into cart with a unique constraint to prevent duplicates
        const query = `
            INSERT INTO cart (user_email, product_id, quantity)
            VALUES (?, ?, 1)
            ON DUPLICATE KEY UPDATE quantity = quantity + 1
        `;
        connection.query(query, [userEmail, productId], (error) => {
            if (error) {
                console.error('Database Error:', error);
                return res.status(500).send('Internal Server Error.');
            }

            res.status(200).send('Product added to cart.');
        });
    });
});



// // Remove a product from the cart
// router.post('/remove', (req, res) => {
//     const { productId } = req.body;
//     const userEmail = req.session.user?.email; // Retrieve email from session

//     if (!userEmail) {
//         return res.status(401).send('User not logged in.');
//     }

//     const query = 'DELETE FROM cart WHERE user_email = ? AND product_id = ?';
//     connection.query(query, [userEmail, productId], (error, results) => {
//         if (error) {
//             console.error('Database Error:', error);
//             return res.status(500).send('Internal Server Error.');
//         }
//         res.status(200).send('Product removed from cart.');
//     });
// });

// Get all cart items for a user
router.get('/', (req, res) => {
    const userEmail = req.session.user?.email;
    if (!userEmail) {
        return res.status(401).send('User not logged in.');
    }
    const query = `
    SELECT c.id, c.product_id, p.name, p.price, p.imageUrl, c.quantity
    FROM cart c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_email = ?
    `;
    connection.query(query, [userEmail], (error, results) => {
        if (error) {
            console.error('Database Error:', error);
            return res.status(500).send('Internal Server Error.');
        }
        console.log('Cart items:', results);
        res.json(results);
    });
});


// Remove a specific item from the cart
// Remove a specific item from the cart using cart item ID
// Remove a specific item from the cart using cart item ID
router.delete('/:cartItemId', (req, res) => {
    const { cartItemId } = req.params;
    const userEmail = req.session.user?.email;

    if (!userEmail) {
        return res.status(401).send('User not logged in.');
    }

    // First, check the current quantity
    const checkQuery = 'SELECT quantity FROM cart WHERE id = ? AND user_email = ?';
    connection.query(checkQuery, [cartItemId, userEmail], (error, results) => {
        if (error) {
            console.error('Database Error:', error);
            return res.status(500).send('Internal Server Error.');
        }

        if (results.length === 0) {
            return res.status(404).send('Cart item not found.');
        }

        const currentQuantity = results[0].quantity;
        console.log("Current Quantity value:", currentQuantity);
        if (currentQuantity > 1) {
            // If more than one, decrement the quantity
            const updateQuery = 'UPDATE cart SET quantity = quantity - 1 WHERE id = ?';
            connection.query(updateQuery, [cartItemId], (error, updateResults) => {
                if (error) {
                    console.error('Database Error on update:', error);
                    return res.status(500).send('Internal Server Error.');
                }
                res.status(200).send('Quantity decreased by one.');
            });
        } else {
            // If exactly one, remove the item
            const deleteQuery = 'DELETE FROM cart WHERE id = ?';
            connection.query(deleteQuery, [cartItemId], (error, deleteResults) => {
                if (error) {
                    console.error('Database Error on delete:', error);
                    return res.status(500).send('Internal Server Error.');
                }
                res.status(200).send('Cart item removed.');
            });
        }
    });
});




module.exports = router;
