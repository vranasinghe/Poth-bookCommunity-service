const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));

app.get('/', (req, res) => {
    res.status(200).json({ message : "Hola"});
});

mongoose.connect(process.env.MONGO_URI)
    .then(res => console.log("mongoDB Connected Succesfully"))
    .catch((err) => console.log('MongoDB connection Error: ', err))

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}/`);
});
