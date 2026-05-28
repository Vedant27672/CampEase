const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateBooking, isBookingOwner } = require('../middleware');
const bookings = require('../controllers/bookings');

// Create booking from show page (campground context)
router.post('/campgrounds/:id/bookings', isLoggedIn, validateBooking, catchAsync(bookings.createBooking));

// User booking history
router.get('/bookings', isLoggedIn, catchAsync(bookings.index));

// Calendar view — must come before /:bookingId to avoid conflict
router.get('/bookings/calendar', isLoggedIn, catchAsync(bookings.renderCalendar));

// Booking confirmation / detail
router.get('/bookings/:bookingId', isLoggedIn, catchAsync(bookings.showConfirmation));

// Cancel a booking
router.post('/bookings/:bookingId/cancel', isLoggedIn, isBookingOwner, catchAsync(bookings.cancelBooking));

module.exports = router;
