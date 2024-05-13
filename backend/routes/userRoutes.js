const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const connection = require('../db'); // Import the database connection
router.use('/uploads', express.static('uploads'));

// User registration route
router.post('/register', async (req, res) => {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create the user object
        const user = { username: req.body.username, email: req.body.email, password: hashedPassword };

        // Insert the user data into the database
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        connection.query(query, [user.username, user.email, user.password], (error, results) => {
            if (error) {
                console.error('Database Error:', error);
                return res.status(500).send('Error while registering user.');
            }

            // Set the session
            req.session.user = user;

            // Send a success response and return
            console.log('User registered successfully:', results);
            return res.status(201).send('User registered successfully.');
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error.');
    }
});



// User login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Query the database to find the user with the provided email
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], async (error, results) => {
        if (error) {
            console.error('Database Error:', error);
            return res.status(500).send('Internal Server Error.');
        }

        if (results.length === 0) {
            return res.status(401).send('No user found with this email.');
        }

        const user = results[0];

        // Compare the entered password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Incorrect password.');
        }

        // Set the session for the authenticated user
        req.session.user = { username: user.username, email: user.email };

        // Respond with success
        console.log('User logged in successfully:', user);
        return res.status(200).send('User logged in successfully.');
    });
});

// User logout route
router.post('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout Error:', err);
            return res.status(500).send('Internal Server Error.');
        }

        res.clearCookie('connect.sid'); // Clear the session cookie
        console.log('User logged out successfully.');
        return res.status(200).send('User logged out successfully.');
    });
});

// Route to get current user session data
router.get('/current', (req, res) => {
    // Check if the user is logged in through the session
    if (req.session.user) {
        return res.status(200).json({ username: req.session.user.username });
    } else {
        return res.status(401).json({ error: 'No user session found' });
    }
});

// Endpoint to get the current user's profile data
router.get('/profile', (req, res) => {
    const userEmail = req.session.user?.email;
    if (!userEmail) {
        return res.status(401).send('User not logged in.');
    }

    const query = 'SELECT username, email, profilePicture FROM users WHERE email = ?';
    connection.query(query, [userEmail], (error, results) => {
        if (error || results.length === 0) {
            console.error('Database Error:', error);
            return res.status(500).send('Internal Server Error.');
        }
        res.json(results[0]);
    });
    });

// Update Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    }
});
const upload = multer({ storage });




// Update profile picture endpoint
router.post('/upload-profile-picture', upload.single('profilePicture'), (req, res) => {
    const userEmail = req.session.user?.email;
    if (!userEmail) {
        return res.status(401).send('User not logged in.');
    }

    // Update profile picture URL in the database
    const profilePictureUrl = `/uploads/${req.file.filename}`;
    const query = 'UPDATE users SET profilePicture = ? WHERE email = ?';
    connection.query(query, [profilePictureUrl, userEmail], (error) => {
        if (error) {
            console.error('Database Error:', error);
            return res.status(500).send('Internal Server Error.');
        }
        res.status(200).send('Profile picture updated successfully.');
    });
});

// Add a profile update endpoint
router.post('/update-profile', (req, res) => {
    const { username, email } = req.body;
    const userEmail = req.session.user?.email;
    if (!userEmail) {
        return res.status(401).send('User not logged in.');
    }

    const query = 'UPDATE users SET username = ?, email = ? WHERE email = ?';
    connection.query(query, [username, email, userEmail], (error) => {
        if (error) {
            console.error('Database Error:', error);
            return res.status(500).send('Internal Server Error.');
        }
        // Update session data
        req.session.user = { username, email };
        res.status(200).send('Profile updated successfully.');
    });
});


module.exports = router;
