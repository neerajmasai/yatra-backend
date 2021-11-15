//FLIGHT CONTROLLER
var axios = require("axios").default;
const { DateTime, Duration } = require("luxon");

//API keys
const { SKYSCANNER_API_HOST, SKYSCANNER_API_KEY, HOST, PORT } = require("../config/dbconfig.js");

//create a router
const express = require("express");
const router = express.Router();


//Http Verbs

// get flight price for oneway
router.post("/search/oneway", async function (req, res) {

    /* TODO:
        0. construct payload for skyscanner
        1. fetch flight data from skyscanner 
        2. based on request dates filter data from api response
        3. construct custom object with refined flight data
        4. send response with custom object
    */
    try {
        //REQUEST SKYSCANNER

        //SKYSCANNER PAYLOAD
        const countryCode = "IN";
        const currencyCode = "INR";
        const locale = "en-US";
        const originPlace = req.body.originCode;
        const destinationPlace = req.body.destinationCode;
        const departureDate = req.body.departureDate;

        var options = {
            method: 'GET',
            url: `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${countryCode}/${currencyCode}/${locale}/${originPlace}/${destinationPlace}/${departureDate}`,
            headers: {
            'x-rapidapi-host': SKYSCANNER_API_HOST,
            'x-rapidapi-key': SKYSCANNER_API_KEY
            }
        };
        
        axios.request(options).then(function (response) {
            
            //error handling
            if(response.data.Quotes.length === 0){
                //if route not found then return all data
                return res.status(404).send("Data invalid or not available");
            }

            //get airplane specific details from db
            axios.get(`http://${HOST}:${PORT}/airplanes`).then(function (airplaneData) {

                //Construct response object
                const customObj = constructFlightDataResponse(req.body, response.data.Quotes, response.data.Carriers, airplaneData.data);
                return res.status(200).send(customObj);
            }).catch(function (error) {
                //console.error(error);
            }); 


        }).catch(function (error) {
            //console.log(error);
            return res.status(404).send("Data invalid or unavailable.");
        });        
    } catch (error) {
        //console.log(error);
        return res.status(404).send("Data invalid or unavailable.");
    }

})

//get all flight prices
router.post("/search/oneway/all", function (req, res) {

    /* TODO:
        0. construct payload for skyscanner
        1. fetch flight data from skyscanner 
        2. based on request dates filter data from api response
        3. construct custom object with refined flight data
        4. send response with custom object
    */

    //REQUEST SKYSCANNER
    try {
        //SKYSCANNER PAYLOAD
        const countryCode = "IN";
        const currencyCode = "INR";
        const locale = "en-US";
        const originPlace = req.body.originCode;
        const destinationPlace = req.body.destinationCode;
        const departureDate = "anytime";
        console.log(req.body);
        var options = {
            method: 'GET',
            url: `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${countryCode}/${currencyCode}/${locale}/${originPlace}/${destinationPlace}/${departureDate}`,
            headers: {
            'x-rapidapi-host': SKYSCANNER_API_HOST,
            'x-rapidapi-key': SKYSCANNER_API_KEY
            }
        };
        
        axios.request(options).then(function (response) {
            console.log(options);
            console.log(response);
            if(response.data.Quotes.length === 0){
                //if route not found then return all data
                return res.status(404).send("Data invalid or not available");
            }

            //get airplane specific details from db
            axios.get(`http://${HOST}:${PORT}/airplanes`).then(function (airplaneData) {

                //Construct response object
                const customObj = constructFlightDataResponse(req.body, response.data.Quotes, response.data.Carriers, airplaneData.data);
                return res.status(200).send(customObj);
            }).catch(function (error) {
                console.log(error.data);
                return res.status(404).send("Data invalid or unavailable.");
            }); 


        }).catch(function (error) {
            //console.log(error);
            return res.status(404).send("Data invalid or unavailable.");
        });        
    } catch (error) {
        //console.log(error);
        return res.status(404).send("Data invalid or unavailable.");
    }

})


//UTILITIES

function constructFlightDataResponse(custom, info, flight, plane){
    /* TODO:
        0. Construct a skeleton of response data
        1. Loop over each info
            a. extract price, direct
            b. From outboundLeg extract departureDate
            c. From outboundLeg call another function to find carrier details
            d. create new field "airplaneName" and save info from carrier details
            e. embed additional info such as travellers, travelclass.
            f. calculate total_fare for that flight = (adults + kids + infants) * price * travelclass
        2. return custom response obj
    */    

    let flightDetails = [];

    //extract data from response
    for(let i=0; i<info.length; i++){
        try {
            //get airplane details
            let carrier = getCarrierDetails(info[i].OutboundLeg.CarrierIds[0], flight, plane);   

            //fill in rest of details

            //random duration generation
            let durationHours = generateRandomHours();
            let durationMins = generateRandomMins();

            //format dates
            let departureShort = formatDate(info[i].OutboundLeg.DepartureDate);

            //calulcate arrival time
            let arrivalTime = calculateArrivalTime(durationHours, durationMins, info[i].OutboundLeg.DepartureDate);
            
            //calculate departure time
            let departureTime = calculateArrivalTime(durationHours-5, durationMins-5, info[i].OutboundLeg.DepartureDate);
            
            //calculate fare
            let fare = calculateFare(info[i].MinPrice, custom.travellers, custom.travelClass);

            let response = {
                origin: custom.origin,
                originCode: custom.originCode,
                originAirport: custom.originAirport,
                destination: custom.destination,
                destinationCode: custom.destinationCode,
                destinationAirport: custom.destinationAirport,
                airplane: {
                    name: carrier.name,
                    logo: carrier.logo
                },
                nonstop: info[i].Direct,
                departure: {
                    date: info[i].OutboundLeg.DepartureDate,
                    dateShort: departureShort,
                    time: departureTime
                },
                arrival: arrivalTime,
                duration: {
                    hours: durationHours,
                    mins: durationMins
                },
                travellers: custom.travellers,
                travelClass: custom.travelClass,
                pricePerHead: info[i].MinPrice,
                totalFare: fare,
        
            }        

            flightDetails.push(response);       

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    return flightDetails;
}

function generateRandomHours(){
    return Math.floor(Math.random() * 20);
}
function generateRandomMins(){
    return Math.floor(Math.random() * 60);
}

function calculateFare(price, travellers, travelClass){
    let multiplier;
    if(travelClass === 1){
        multiplier = 1.5;
    }
    else if(travelClass === 2){
        multiplier = 1.8;
    }
    else{
        multiplier = 1;
    }
    return Math.floor( price * multiplier * (travellers.adults + travellers.kids + travellers.infants) );
}

function calculateDepartureTime(dateStr){
    return DateTime.fromISO(dateStr).toLocaleString(DateTime.TIME_24_SIMPLE);
}

function formatDate(departure){
    let depart = DateTime.fromISO(departure);
    return depart.toLocaleString({ weekday: 'long', day: '2-digit', month: 'long' });
}

function calculateArrivalTime(durationHours, durationMins, departure){
    let depart = DateTime.fromISO(departure);
    let arrival = depart.plus(Duration.fromObject({ hours: durationHours, minutes: durationMins }));
    return arrival.toLocaleString(DateTime.TIME_24_SIMPLE);    
}

function getCarrierDetails(id, carriers, plane){

    for(let i=0;i<carriers.length; i++){
        if(carriers[i].CarrierId === id){
            for(let j=0; j<plane.length; j++){
                if(plane[j].name === carriers[i].Name){
                    return plane[j];
                }
            }
        }
    }
}
//export
module.exports = router;
