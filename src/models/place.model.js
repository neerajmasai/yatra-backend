//PLACE MODEL

const mongoose = require("mongoose");
const { Schema } = mongoose;

//place schema
const placeSchema = new Schema({

    placeName: { type: String, required: true },
    airportName: { type: String, required: false },
    placeCode: { type: String, required: true },
    countryName: { type: String, required: true },
    apiCode: { type: String, required: false },


}, {timestamps: false, versionKey: false});

//creating model for place
const Place = mongoose.model("Place", placeSchema);

//export
module.exports = Place;