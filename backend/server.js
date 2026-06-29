const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Bind to all interfaces so LAN clients can connect

// Explicit CORS config — allows specific origins and necessary headers
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:8080',
            'http://localhost:8081',
            'http://localhost:5000',
            'https://poth-bookcommunity-service-production.up.railway.app',
            'https://poth-bookcommunityservice.netlify.app'
        ];
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin === '*') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/shops', require('./routes/shopRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Poth API is running' });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('mongoDB Connected Successfully'))
    .catch((err) => {
        if (err.name === 'MongoNetworkTimeoutError') {
            console.error('MongoDB connection timed out. Check Atlas IP whitelist at cloud.mongodb.com → Security → Network Access');
        } else {
            console.error('MongoDB connection Error:', err.message);
        }
        process.exit(1);
    });

app.listen(PORT, HOST, () => {
    console.log(`Server is listening on http://localhost:${PORT}/`);
});
