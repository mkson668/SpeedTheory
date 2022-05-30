// setup express router
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// register
router.post("/register", (req, res) => {
    // get the user values from the request body
    // refer back to models/User.js for the valid properties
    const newUser = new User(
        {
            username: req.body.username,
            email: req.body.email,
            // enable encryption using crypto-js
            password: CryptoJS.AES.encrypt( req.body.password, process.env.PASSWORD_SECRET).toString(),
        }
    )

    // now we need to save this new user to to our MongoDB
    // note: this is async we uses promises
    // note: mongoDB.save() is an async function that returns a promise
    // https://mongoosejs.com/docs/api.html#document_Document-save
    newUser.save().then((result) => {
        console.log("user has been successfully added to DB:" + result);
        res.status(201).json(result);
    }).catch((error) => {
        console.log("user has NOT been added error code: " + error);
        res.status(500).json(error);
    })
});

// login
router.post("/login", (req, res) => {

    // review: for all async functions they will always return a promise
    User.findOne({ username: req.body.username }).then((result) => {
        console.log("found in database: " + result);
        if (!result) {
            res.status(401).json("User does not exist");
        } 
        const hashedPassword = CryptoJS.AES.decrypt(result.password, process.env.PASSWORD_SECRET);
        // console.log("this is hashedPW: " + hashedPassword);

        const unhashedPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        // console.log("this is unhashPW: " + unhashedPassword);

        if (unhashedPassword != req.body.password) {
            res.status(401).json("incorrect user password");
        } else {
            // create JWT for user verifications after login (sync)
            // https://github.com/auth0/node-jsonwebtoken
            const accessToken = jwt.sign({
                id: result._id,
                isAdmin: result.isAdmin
            }, process.env.JWT_SECRET,
            {
                expiresIn: '10h'
            });
            // we should not expose password to browser so destructure it using JS
            const {password, ...others} = result._doc;
            
            // wrap accessToken in object to return it
            res.status(200).json({...others, accessToken});
        }
    }).catch((error) => {
        console.log("error has occured: " + require);
        res.status(500).json(error);
    });
});

module.exports = router