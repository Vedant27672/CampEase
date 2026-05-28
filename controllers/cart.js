const Campground = require('../models/campground');
const Booking = require('../models/booking');

// Show cart
module.exports.renderCart = (req, res) => {
    const cart = req.session.cart || [];
    const grandTotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
    res.render('cart/index', { cart, grandTotal });
};

// Add to cart from show page
module.exports.addToCart = async (req, res) => {
    const campground = await Campground.findById(req.params.id || req.body.campgroundId);
    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }

    const { checkIn, checkOut, guests } = req.body.booking;
    const checkInDate  = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (!checkIn || !checkOut || checkOutDate <= checkInDate) {
        req.flash('error', 'Please select valid check-in and check-out dates.');
        return res.redirect(`/campgrounds/${campground._id}`);
    }

    const nights    = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const itemTotal = parseFloat((campground.price * nights).toFixed(2));

    if (!req.session.cart) req.session.cart = [];

    // Prevent duplicate: same campground + overlapping dates
    const duplicate = req.session.cart.some(item => {
        if (item.campgroundId !== campground._id.toString()) return false;
        const existIn  = new Date(item.checkIn);
        const existOut = new Date(item.checkOut);
        return checkInDate < existOut && checkOutDate > existIn;
    });
    if (duplicate) {
        req.flash('error', 'This campground with overlapping dates is already in your cart.');
        return res.redirect(`/campgrounds/${campground._id}`);
    }

    req.session.cart.push({
        campgroundId:    campground._id.toString(),
        campgroundTitle: campground.title,
        campgroundSlug:  campground._id.toString(),
        price:           campground.price,
        thumbnail:       campground.images && campground.images.length > 0 ? campground.images[0].url : null,
        checkIn,
        checkOut,
        nights,
        itemTotal,
        guests: guests || 1,
        location: campground.location
    });

    req.flash('success', `"${campground.title}" added to your cart!`);
    res.redirect(`/campgrounds/${campground._id}`);
};

// Remove item from cart
module.exports.removeFromCart = (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (!req.session.cart) req.session.cart = [];
    if (index >= 0 && index < req.session.cart.length) {
        req.session.cart.splice(index, 1);
    }
    res.redirect('/cart');
};

// Checkout: conflict-check all items then create bookings
module.exports.checkout = async (req, res) => {
    const cart = req.session.cart || [];
    if (!cart.length) {
        req.flash('error', 'Your cart is empty.');
        return res.redirect('/cart');
    }

    // Conflict-check every item first (fail-all-or-nothing)
    for (const item of cart) {
        const checkInDate  = new Date(item.checkIn);
        const checkOutDate = new Date(item.checkOut);
        const conflict = await Booking.findOne({
            campground: item.campgroundId,
            status: 'confirmed',
            checkIn:  { $lt: checkOutDate },
            checkOut: { $gt: checkInDate }
        });
        if (conflict) {
            req.flash('error', `"${item.campgroundTitle}" is already booked for those dates. Please update your cart.`);
            return res.redirect('/cart');
        }
    }

    // All clear — create all bookings
    const bookingDocs = cart.map(item => ({
        campground: item.campgroundId,
        user:       req.user._id,
        checkIn:    new Date(item.checkIn),
        checkOut:   new Date(item.checkOut),
        totalPrice: item.itemTotal,
        guests:     item.guests || 1
    }));

    await Booking.insertMany(bookingDocs);
    req.session.cart = [];
    req.flash('success', `${bookingDocs.length} booking${bookingDocs.length > 1 ? 's' : ''} confirmed!`);
    res.redirect('/bookings');
};
