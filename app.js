if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const bookingRoutes = require('./routes/bookings');
const cartRoutes = require('./routes/cart');
const Campground = require('./models/campground');
const Review = require('./models/review');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger-output.json');
const db_url = process.env.atlas_URL;
const MongoDBStore = require('connect-mongo');

mongoose.connect(db_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.set('trust proxy', 1); // trust Render/Heroku reverse proxy for correct protocol detection

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const store = new MongoDBStore({
    mongoUrl: db_url,
    secret: process.env.SESSION_SECRET || 'campease-session-secret',
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
});
const sessionConfig = {
    store,
    secret: process.env.SESSION_SECRET || 'campease-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // Link existing local account if same email
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
        }

        // New Google-only user — derive a unique username
        const baseUsername = (profile.displayName || 'user').replace(/\s+/g, '').toLowerCase();
        const username = baseUsername + '_' + profile.id.slice(-4);
        user = new User({ googleId: profile.id, email: profile.emails[0].value, username });
        await user.save();
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
} // end if GOOGLE_CLIENT_ID

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.mapTilerToken = process.env.MAPTILER_TOKEN;
    res.locals.cartCount = (req.session.cart || []).length;
    next();
})


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
    customSiteTitle: 'CampEase API Docs',
    customCss: '.swagger-ui .topbar { display: none }'
}));

app.use('/', userRoutes);
app.use('/', cartRoutes);
app.use('/', bookingRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.get('/', async (req, res) => {
    const [campgroundCount, reviewCount, userCount, locations] = await Promise.all([
        Campground.countDocuments(),
        Review.countDocuments(),
        User.countDocuments(),
        Campground.distinct('location')
    ]);
    res.render('home', {
        stats: {
            campgrounds: campgroundCount,
            reviews:     reviewCount,
            campers:     userCount,
            locations:   locations.length
        }
    });
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})


