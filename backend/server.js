const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const adminRoutes = require('./routes/adminRoutes');




app.use(bodyParser.json());

const cors = require('cors');

// Enable CORS with credentials support
app.use(cors({
    origin: 'http://localhost:3000', // Adjust to your frontend's URL
    credentials: true
}));

// Set up session handling as before
app.use(session({
    secret: 'some_Secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Dummy route for testing
app.get('/', (req, res) => {
    res.json({ message: "Welcome to our Jewelry Shop API." });
});

app.use(express.json()); // for parsing application/json
app.use('/api/users', userRoutes);



app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from the 'uploads' folder in the backend directory
app.use('/uploads', express.static(__dirname + '/uploads'));



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});


