const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'CampEase API',
        description: 'Auto-generated route documentation for the CampEase campground booking platform.',
        version: '1.0.0',
        contact: {
            name: 'Vedant Singh Chauhan',
            url: 'https://github.com/Vedant27672'
        }
    },
    host: 'localhost:3000',
    schemes: ['http', 'https'],
    tags: [
        { name: 'Campgrounds', description: 'Browse, create, edit and delete campgrounds' },
        { name: 'Reviews',     description: 'Add and remove campground reviews' },
        { name: 'Bookings',    description: 'Book campgrounds and manage reservations' },
        { name: 'Cart',        description: 'Session cart for bulk booking' },
        { name: 'Auth',        description: 'User registration, login, and Google OAuth' }
    ],
    securityDefinitions: {
        session: {
            type: 'apiKey',
            in:   'cookie',
            name: 'connect.sid'
        }
    }
};

const outputFile   = './swagger-output.json';
const routeFiles   = [
    './routes/campgrounds.js',
    './routes/reviews.js',
    './routes/bookings.js',
    './routes/cart.js',
    './routes/users.js'
];

swaggerAutogen(outputFile, routeFiles, doc);
