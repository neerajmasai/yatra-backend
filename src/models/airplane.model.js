//USER MODEL

const mongoose = require("mongoose");
const { Schema } = mongoose;

//airplane schema
const airplaneSchema = new Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true },
}, {
    timestamps: false, 
    versionKey: false});

//creating model for airplane
const Airplane = mongoose.model("Airplane", airplaneSchema);

//export
module.exports = Airplane;