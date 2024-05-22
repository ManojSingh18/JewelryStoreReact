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
const fetchGoldRate = require('./routes/scrapGoldRates');




app.use(bodyParser.json());

const cors = require('cors');

// Enable CORS with credentials support
app.use(cors({
    origin: ['http://localhost:3000', 'file://'], // Allow both web and Electron origins
    credentials: true
}));


// Add middleware to handle Electron-specific requests
app.use((req, res, next) => {
    if (req.headers['user-agent'] && req.headers['user-agent'].includes('Electron')) {
      res.setHeader('Access-Control-Allow-Origin', 'file://');
    }
    next();
  });

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

app.get('/api/gold-rate', async (req, res) => {
    try {
      const goldRates = await fetchGoldRate();
      if (goldRates) {
        const timestamp = new Date().toISOString();
        console.log('Gold Rates:', goldRates);
        console.log('Timestamp:', timestamp);
        res.json({ goldRates, timestamp });
      } else {
        res.status(500).json({ error: 'Failed to fetch gold rates' });
      }
    } catch (error) {
      console.error('Error in /api/gold-rate endpoint:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

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


