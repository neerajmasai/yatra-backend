//BOOKING MODEL

const mongoose = require("mongoose");
const { Schema } = mongoose;


//transaction schema
const bookingSchema = new Schema({

    user: { type: Object, required: true },

    //booking info
    booking: { type: Object, required: true },

}, {timestamps: true, versionKey: false});

//creating model for booking
const Booking = mongoose.model("Booking", bookingSchema);

//export
module.exports = Booking;