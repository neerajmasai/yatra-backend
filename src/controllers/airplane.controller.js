//AIRPLANE CONTROLLER

//create a router
const express = require("express");
const router = express.Router();

//models
const Airplane = require("../models/airplane.model.js");

//Http Verbs will come here GET, GET by id, POST, PATCH, DELETE

//get all airplanes
router.get("/", async (request, response) => {
    try {
        const results = await Airplane.find().lean().exec();
        return response.send(results);
    }
    catch (err) {
        response.status(401).send(err.message);
    }
});

//get specific airplane by id
router.get("/:id", async (request, response) => {
    try {
        const results = await Airplane.findById(request.params.id);
        console.log(results);
        return response.send(results);
    }
    catch (err) {
        response.status(401).send(err.message);
    }
});

//get user by name
router.get("/search/:name", async (request, response) => {
    try {
        const results = await Airplane.find({ name: request.params.name }).lean().exec();
        console.log(results);
        return response.send(results);
    }
    catch (err) {
        response.status(401).send(err.message);
    }
});

//create airplane
router.post("/", async (request, response) => {
    try {
        const results = await Airplane.create(request.body);
        return response.status(201).send(results);
    }
    catch (err) {
        response.status(401).send(err.message);
    }
});

//update airplane by id
router.patch("/:id", async (request, response) => {
    try {
        const results = await Airplane.findByIdAndUpdate(request.params.id, request.body, { new: true });
        console.log(results);
        return response.send(results);
    }
    catch (err) {
        response.status(401).send(err.message);
    }
});


//delete airplane by id
router.delete("/:id", async (request, response) => {
    try {
        const results = await Airplane.findByIdAndDelete(request.params.id);
        console.log(results);
        return response.send(results);
    }
    catch (err) {
        response.status(401).send(err.message);
    }
});




//export
module.exports = router;
