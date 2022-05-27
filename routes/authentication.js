// setup express router
const express = require("express");
const router = express.Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js")

// register
router.post("/register", (req, res) => {
    // get the user values from the request body
    // refer back to models/User.js for the valid properties
    const newUser = new User(
        {
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt( req.body.password, process.env.PASSWORD_SECRET),
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

module.exports = router