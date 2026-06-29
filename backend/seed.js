const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/userModel');
const Shop = require('./models/shopModel');
const Book = require('./models/bookModel');
const Review = require('./models/reviewModel');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await User.deleteMany();
        await Shop.deleteMany();
        await Book.deleteMany();
        await Review.deleteMany();

        console.log('Data Cleared!');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // Create Users
        const createdUsers = await User.insertMany([
            {
                firstName: 'Nandun',
                lastName: 'Samarasekara',
                email: 'nandun@example.com',
                password: hashedPassword,
                userType: 'Customer',
                nearestCity: 'Colombo',
                phoneNumber: '0712345678'
            },
            {
                firstName: 'Kamal',
                lastName: 'Perera',
                email: 'kamal@sarasavi.lk',
                password: hashedPassword,
                userType: 'Shop Owner',
                nearestCity: 'Nugegoda',
                phoneNumber: '0112820000'
            },
            {
                firstName: 'Saman',
                lastName: 'Kumara',
                email: 'saman@vijithayapa.lk',
                password: hashedPassword,
                userType: 'Shop Owner',
                nearestCity: 'Colombo',
                phoneNumber: '0112555555'
            }
        ]);

        const customer = createdUsers[0]._id;
        const sarasaviOwner = createdUsers[1]._id;
        const vijithaOwner = createdUsers[2]._id;

        // Create Shops
        const createdShops = await Shop.insertMany([
            {
                shopOwner: sarasaviOwner,
                name: 'Sarasavi Bookshop',
                description: 'Sri Lanka’s largest bookshop chain with a wide collection of educational, literary, and children books.',
                location: 'Nugegoda',
                contactNumber: '0112820000',
                imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&q=80',
                averageRating: 4.8,
                numReviews: 0
            },
            {
                shopOwner: vijithaOwner,
                name: 'Vijitha Yapa Bookshop',
                description: 'The largest English bookstore chain in Sri Lanka, offering a diverse array of international titles.',
                location: 'Colombo 04',
                contactNumber: '0112501000',
                imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&q=80',
                averageRating: 4.5,
                numReviews: 0
            }
        ]);

        const sarasaviId = createdShops[0]._id;
        const vijithaId = createdShops[1]._id;

        // Create Books
        await Book.insertMany([
            {
                title: 'Madol Doova',
                author: 'Martin Wickramasinghe',
                description: 'A classic Sri Lankan coming-of-age novel following the adventures of Upali and Jinna.',
                price: 850,
                shop: sarasaviId,
                category: 'Fiction',
                stockCount: 50,
                imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1321484161i/13010468.jpg'
            },
            {
                title: 'Amba Yahaluwo',
                author: 'T. B. Ilangaratne',
                description: 'A heartwarming story about the friendship between two boys from different social classes in Sri Lanka.',
                price: 750,
                shop: sarasaviId,
                category: 'Children',
                stockCount: 30,
                imageUrl: 'https://m.media-amazon.com/images/I/41eP9C-u2VL._AC_SY780_.jpg'
            },
            {
                title: 'Sapiens: A Brief History of Humankind',
                author: 'Yuval Noah Harari',
                description: 'Explores the history of our species from the Stone Age up to the twenty-first century.',
                price: 3500,
                shop: vijithaId,
                category: 'History',
                stockCount: 15,
                imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1420585954i/23692271.jpg'
            },
            {
                title: 'The Seven Moons of Maali Almeida',
                author: 'Shehan Karunatilaka',
                description: 'Winner of the 2022 Booker Prize. A dead war photographer wakes up in what seems like a celestial visa office.',
                price: 2800,
                shop: vijithaId,
                category: 'Fiction',
                stockCount: 20,
                imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655110595i/61273390.jpg'
            }
        ]);

        console.log('Data Imported!');
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB().then(() => {
    seedData();
});
