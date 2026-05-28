const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    campground: { type: Schema.Types.ObjectId, ref: 'Campground', required: true },
    user:       { type: Schema.Types.ObjectId, ref: 'User',       required: true },
    checkIn:    { type: Date, required: true },
    checkOut:   { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    guests:     { type: Number, default: 1, min: 1, max: 20 },
    status:     { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    createdAt:  { type: Date, default: Date.now }
});

BookingSchema.virtual('nights').get(function () {
    return Math.round((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Booking', BookingSchema);
