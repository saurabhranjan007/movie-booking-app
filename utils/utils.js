const {atob , btoa} = require("b2a");
const db = require("../models");
const Movie = db.movie;

/**
 * Function to get first and last name from artists string for filtering purpose
 * @param {String} artists - comma seperated strings which represent first and last name of an author
 * @returns {Object} - Obect containing first name and last name array
 */

const splitIntoFirstAndLastName = (artists) => {
    const artistSplitArray = artists.split(",");
        /*
            split aritsts array into first_name array and last_name array
        */
    let first_name = [];
        let last_name = [];
        for (let i = 0; i < artistSplitArray.length; i++) {
            let singleSplit = artistSplitArray[i].split(" ");
            first_name.push(singleSplit[0]);
            last_name.push(singleSplit[1]);
        }
        // Debuggin purpose
        // console.log("First name array: ", first_name);
        // console.log("Last name Array:  ", last_name);
        return {first_name, last_name};
}

/**
 * Function to extract username and password from authorization header
 * @param {String} authorization - Authorization header
 * @returns {Object} - Object containing decoded username and password
 */

const extractUsernameAndPassword = (authorization) => {

const authorizationArray = authorization.split(" ");
const userNamePasswordEncoded = authorizationArray[1];
const userNamePasswordDecoded = atob(userNamePasswordEncoded);
const userNamePasswordArray = userNamePasswordDecoded.split(":");
const username = userNamePasswordArray[0];
const password = userNamePasswordArray[1];

return {username, password};
}

/**
 * Function to extract access-token from authorization header
 * @param {String} authHeader - Authorization header
 * @returns {String} - access-token
 */

const extractAccessToken = (authHeader) => {
    // authHeader --> "Bearer access-token"
    let authHeaderArray = authHeader.split(" ");
    let access_token = authHeaderArray[1];
    return access_token;
}

/**
 * Function to get discount based on the coupen id provided in request body of post request
 * @param {Array} coupenArray - coupen array of a matched movie
 * @param {String} coupenCode - String obtained from url query parameters
 * @returns {Number} - discount based on the coupenCode specified
 */


const getCoupenDiscount = (coupenArray, coupenCode) => {
    let coupenId = 0;
    let discount = 0;
    let outerFlag = false;
    for(let i = 0 ; i < coupenArray.length ; i++) {
        let coupenObj = coupenArray[i];
        console.log("Coupen obj single: ", coupenObj);
        if(coupenObj.id == coupenCode) {
            console.log("Entered if block")
            discount = coupenObj.discountValue;
            outerFlag = true;
            break;
        }
        if(outerFlag) {
            break;
        }
    }
    return discount;
}

/**
 * Function to return tickets array with individual ticket numbers as elements
 * @param {Array} tickets - tickets array is a single element array with element as a string with comma seperated values of ticket seat numbers
 * @returns {Array} - tickets Array
 */

const getTicketsArray = (tickets) => {
    let ticketsString = tickets[0];
    let ticketsArray = ticketsString.split(",");
    let newTicketsArray = [];
    newTicketsArray = ticketsArray.map(ticket => Number(ticket));
    return newTicketsArray;
}

/**
 * Function to update avilable seats of a show of a movie based on user bookings
 * @param {String} show_id - show id of the movie for which ticket is being booked (Obtained for post request body)
 * @returns {null}
 */

const updateAvailableSeats = ( show_id ,ticketsArray) => {
    let seatsTaken = ticketsArray.length;
    Movie.findOne({"shows.id" : show_id})
    .then(movie => {
        if(movie !== null) {
            let shows = movie.shows;
            for(let i = 0 ; i < shows.length ; i++) {
                let showSingleObj = shows[i];
                if(showSingleObj.id == show_id) {
                    let extractedSeats = Number(showSingleObj.available_seats);
                    let newSeats = extractedSeats - seatsTaken;
                    movie.shows[i].available_seats = newSeats.toString();
                    movie.save()
                    .then(() => console.log("Seats updated"))
                    .catch(() =>console.log("Seats Updation failed") )
                }
            }
        }
        else {
            console.log("No movie found to update seats");
        }
    })
    .catch(err => console.log("Error in server finding ", err))
}

module.exports = {splitIntoFirstAndLastName, extractUsernameAndPassword, extractAccessToken, getCoupenDiscount, getTicketsArray, updateAvailableSeats};
