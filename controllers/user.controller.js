const { user } = require("../models");
const db = require("../models");
const User = db.user;
const Movie = db.movie;
const utils = require("../utils/utils");
const { fromString, isUuid } = require("uuidv4");
const TokenGenerator = require('uuid-token-generator');

const token = new TokenGenerator(); // Default is a 128-bit token encoded in base58

exports.login = (req, res) => {
    // console.log("Request recieved for authorization");
    const authorization = req.headers["authorization"];
    // console.log("Authorization header: ", authorization);
    const { username, password } = utils.extractUsernameAndPassword(authorization);
    // console.log("username: ", username);
    // console.log("password: ", password);
    const filter = { username: username };
    User.findOne(filter)
        .then(user => {
            if (user === null) {
                res.status(400).json({ message: "username or password is incorrect" });
            }
            else {

                if (password === user.password) {
                    let uuid = fromString(user.username);
                    // console.log("uuid generated is: ", uuid);
                    let tokenGenerated = token.generate();
                    // console.log("access-token genereated: ", tokenGenerated);
                    user.isLoggedIn = true;
                    user.uuid = uuid;
                    user["access-token"] = tokenGenerated;
                    user.save();
                    res.status(200).json({
                        message: "logged in successfully",
                        ["access-token"]: tokenGenerated,
                        id: uuid
                    })
                }
                else {
                    res.status(400).json({ message: "Invalid Password" });
                }
            }
        })
        .catch(err => {
            console.log("Error in logging: ", err);
            res.status(500).json({ message: "Error in logging please try again" });
        })


}

exports.logout = (req, res) => {
    // console.log("Request recieved for logout");
    const { uuid } = req.body;
    // console.log("uuid recieved for loging out", uuid);
    if (isUuid(uuid)) {
        User.findOne({ uuid: uuid })
            .then(user => {
                res.status(200).json({ message: "Logged Out successfully." });
                user.uuid = "";
                user.isLoggedIn = false;
                user["access-token"] = "";
                user.save();
            })
            .catch(err => {
                console.log("Error in logging out:", err);
                res.status(500).json({ message: "Error Logging Out" });
            })
    }
    else {
        res.status(500).json({ message: "Invalid uuid" });
    }
}



exports.signUp = async (req, res) => {
    // console.log("request recieved for signup");
    let userCount = 0;

    userCount = await User.countDocuments();

    const { email_address, first_name, last_name, mobile_number, password } = req.body;
    // console.log("Recieved data for signup: ", req.body);
    let filter = { email: email_address };

    User.findOne(filter)
        .then((data) => {

            if (data !== null) {
                res.status(400).json({ message: "User already exists" });
            }
            else {
                let signUpData = {
                    email: email_address,
                    first_name: first_name,
                    last_name: last_name,
                    userid: userCount + 1,
                    username: first_name + " " + last_name,
                    contact: mobile_number,
                    password: password,
                };
                let newUser = new User(signUpData);
                newUser.save()
                    .then(data => {
                        res.status(200).json({ message: "Signed up successfully." });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ message: "Error in signing up" });
                    })
            }
        })
        .catch(error => {
            console.log("error in signing up: ", error);
            res.status(500).json({ message: "Error in signing up" });
        })

}


exports.getCouponCode = (req, res) => {
    // console.log("recieved coupon request");
    const { code } = req.query;
    if (code) {
        let authHeader = req.headers["authorization"];

        let access_token = "";
        if (authHeader) {
            access_token = utils.extractAccessToken(authHeader);
        }
        // console.log("Requested access token : ", access_token);
        User.findOne({ ["access-token"]: access_token })
            .then(user => {


                if (user !== null) {

                    const discount = utils.getCoupenDiscount(user.coupens, code);

                    if (discount !== 0) {
                        res.status(200).json({
                            message: "Discount fetched successfully",
                            discountValue: discount
                        })
                    }
                    else {
                        res.status(404).json({
                            message: "No discount available"
                        })
                    }

                }
                else {
                    res.status(400).json({
                        message: "Invalid User token"
                    })
                }
            })
            .catch(err => {
                console.log("Error in finding user for coupons: ", err)
                res.status(500).json({
                    message: "Server Error in fetching discount"
                })
            })

    }
    else {
        res.status(400).json({
            message: "Coupen code not available in url parameters"
        })
    }

}

exports.bookShow = (req, res) => {
    // console.log("Recieved request for booking tickets");
    let authHeader = req.headers["authorization"];
    let access_token = "";
    if (authHeader) {
        access_token = utils.extractAccessToken(authHeader);
    }
    const { customerUuid, bookingRequest: {
        coupon_code, show_id, tickets
    } } = req.body;

    if (isUuid(customerUuid)) {
        const filter = { uuid: customerUuid }
        User.findOne(filter)
            .then(user => {
                if (user === null) {
                    res.status(400).json({ message: "User does not exists" })
                }
                else {
                    if (access_token === user["access-token"]) {
                        let referenceNumber = Math.floor((Math.random() * 90000) + 10000);
                        let ticketsArray = utils.getTicketsArray(tickets);

                        user.bookingRequests.push({
                            reference_number: referenceNumber,
                            coupon_code: coupon_code,
                            show_id: show_id,
                            tickets: [...ticketsArray]
                        });


                        user.save()
                            .then(data => {
                                // console.log("Booking Successful");
                                utils.updateAvailableSeats(show_id, ticketsArray);
                            })
                            .catch(err => console.log("Error in booking tickets: ", err))

                        res.status(200).json({
                            message: "Received Booking Request. Customer is valid",
                            reference_number: referenceNumber
                        })

                    }
                    else {
                        res.status(400).json({ message: "Invalid User" })

                    }
                }
            })
    }

}
