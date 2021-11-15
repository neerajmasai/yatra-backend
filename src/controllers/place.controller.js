//PLACE CONTROLLER
var axios = require("axios").default;
//API keys
const { SKYSCANNER_API_HOST, SKYSCANNER_API_KEY } = require("../config/dbconfig.js");
const { TRIPADVISOR_API_HOST, TRIPADVISOR_API_KEY } = require("../config/dbconfig.js");

//create a router
const express = require("express");
const router = express.Router();

//models
const Place = require("../models/place.model.js");

//Http Verbs will come here GET, GET by id, POST, PATCH, DELETE

// post place to the database 
router.post("/", async function (req, res) {
    try {
        const post = await Place.create(req.body);
        return res.status(201).send(post);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
})

// get all places from database
router.get("/", async function (req, res) {
    try {
        const get = await Place.find().lean().exec();
        return res.status(200).send(get);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
})

// get place by Id
router.get("/:id", async function (req, res) {
    try {
        const getById = await Place.findById().lean().exec();
        return res.status(200).send(getById);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
})

// get place by name
router.get("/query/:name", async function (req, res) {
    try {
        const getByName = await Place.find({placeName: req.params.name}).lean().exec();
        return res.status(200).send(getByName);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
})

// search place by name
router.get("/search/:place", function (req, res) {

    //Get Airport Data
    var options = {
        method: 'GET',
        url: 'https://travel-advisor.p.rapidapi.com/airports/search',
        params: {query: req.params.place, locale: 'en_US'},
        headers: {
          'x-rapidapi-host': TRIPADVISOR_API_HOST,
          'x-rapidapi-key': TRIPADVISOR_API_KEY
        }
      };
      
      axios.request(options).then(function (response) {
          const airport = response.data[0].display_sub_title;

          //Get Place data and construct custom data
          try {
            const place = capitalize(req.params.place);
            var options = {
              method: 'GET',
              url: `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/IN/INR/en-US/`,
              params: {query: place},
              headers: {
                'x-rapidapi-host': SKYSCANNER_API_HOST,
                'x-rapidapi-key': SKYSCANNER_API_KEY
              }
            };
            
            axios.request(options).then(function (response) {
                const placeData = searchPlace(response.data.Places, place);
                if(!placeData){
                    return res.status(404).send("Not found.");
                }
                const placeObj = {
                    placeName : placeData.PlaceName,
                    airportName : airport, 
                    placeCode : placeData.PlaceId.split("-")[0],
                    countryName: placeData.CountryName,
                    apiCode: placeData.PlaceId
                }
                return res.status(200).send(placeObj);
            }).catch(function (error) {
                console.error(error);
                return res.status(400).send(error);
            });
        }
        catch (err) {
            return res.status(400).send(err.message);
        }

      }).catch(function (error) {
          console.error(error);
      });
})


// Update the place in the database
router.patch("/:id", async function (req, res) {
    try {
        const update = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).send(update);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
})

// delete the place from the database
router.delete("/:id", async function(req, res) {
    try {
        const remove = await Place.findByIdAndDelete(req.params.id);
        return res.status(204).send(remove);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
})


//UTILITIES
function searchPlace(places){
    for(let i=0; i<places.length; i++){
        if(places[i].CountryName === "India"){
            return places[i];
        }
    }
}
function capitalize(str){
    let arr = str.split("");
    arr[0] = arr[0].toUpperCase();
    return arr.join("");
}


//export
module.exports = router;
