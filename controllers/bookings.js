const Booking = require('../models/booking');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');

// Create a booking from the show-page widget
module.exports.createBooking = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }

    const { checkIn, checkOut, guests } = req.body.booking;
    const checkInDate  = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
        req.flash('error', 'Check-out must be after check-in.');
        return res.redirect(`/campgrounds/${campground._id}`);
    }

    // Conflict check
    const conflict = await Booking.findOne({
        campground: campground._id,
        status: 'confirmed',
        checkIn:  { $lt: checkOutDate },
        checkOut: { $gt: checkInDate }
    });
    if (conflict) {
        req.flash('error', 'Those dates are already booked. Please choose different dates.');
        return res.redirect(`/campgrounds/${campground._id}`);
    }

    const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const booking = new Booking({
        campground: campground._id,
        user:       req.user._id,
        checkIn:    checkInDate,
        checkOut:   checkOutDate,
        totalPrice: parseFloat((campground.price * nights).toFixed(2)),
        guests:     guests || 1
    });
    await booking.save();
    req.flash('success', 'Booking confirmed!');
    res.redirect(`/bookings/${booking._id}`);
};

// Booking history list
module.exports.index = async (req, res) => {
    const today = new Date();
    const allBookings = await Booking.find({ user: req.user._id })
        .populate('campground')
        .sort({ checkIn: -1 });

    const upcoming = allBookings.filter(b => b.checkIn >= today && b.status === 'confirmed');
    const past     = allBookings.filter(b => b.checkIn < today  || b.status === 'cancelled');

    res.render('bookings/index', { upcoming, past });
};

// Calendar view
module.exports.renderCalendar = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id, status: 'confirmed' })
        .populate('campground');

    const calendarEvents = bookings.map(b => ({
        title: b.campground ? b.campground.title : 'Campground',
        start: b.checkIn.toISOString().split('T')[0],
        end:   b.checkOut.toISOString().split('T')[0],
        url:   `/bookings/${b._id}`,
        color: '#2d6a4f'
    }));

    res.render('bookings/calendar', { calendarEvents });
};

// Booking confirmation / detail page
module.exports.showConfirmation = async (req, res) => {
    const booking = await Booking.findById(req.params.bookingId).populate('campground');
    if (!booking) {
        req.flash('error', 'Booking not found!');
        return res.redirect('/bookings');
    }
    if (!booking.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to view that booking.');
        return res.redirect('/bookings');
    }
    res.render('bookings/confirmation', { booking });
};

// Cancel booking
module.exports.cancelBooking = async (req, res) => {
    // req.booking attached by isBookingOwner middleware
    req.booking.status = 'cancelled';
    await req.booking.save();
    req.flash('success', 'Booking cancelled successfully.');
    res.redirect('/bookings');
};
