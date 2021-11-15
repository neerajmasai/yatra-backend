//config data
const {DEFAULT_CONNECTION_STRING, PORT, MONGOOSE_OPTIONS} = require("./src/config/dbconfig");

//connect to express
const express = require("express");
const app = express();
app.listen(PORT, () => console.log(`Yatra Web App connected successfully to Express. Listening on port ${PORT}...`));

//middlewares
const cors = require("cors");
app.use(cors())
app.use(express.json());

//connect to mongoose
const mongoose = require('mongoose');
mongoose.connect(DEFAULT_CONNECTION_STRING, MONGOOSE_OPTIONS);
mongoose.connection.on("error", err => {
  console.log("Connection Error. Yatra Web App could not successfully connect to Mongoose.", err);
});
mongoose.connection.on("connected", (err, res) => {
    console.log("Yatra Web App connected successfully to Mongoose.");
});

//routes
const productController = require("./src/controllers/product.controller.js");
const userController = require("./src/controllers/user.controller.js");
const transactionController = require("./src/controllers/transaction.controller.js");
const placeController = require("./src/controllers/place.controller.js");
const flightController = require("./src/controllers/flight.controller.js");
const airplaneController = require("./src/controllers/airplane.controller.js");
const bookingController = require("./src/controllers/booking.controller.js");
app.use("/products", productController);
app.use("/users", userController);
app.use("/transactions", transactionController);
app.use("/places", placeController);
app.use("/flights", flightController);
app.use("/airplanes", airplaneController);
app.use("/bookings", bookingController);
