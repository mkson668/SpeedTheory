// setup express router
const express = require("express");
const router = express.Router();
const {verifyToken, verifyTokenAndAuthorization} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const User = require("../models/User");

/* 
// for testing purposes
router.get("/usertest", (req, res) => {
    res.send("user test successful");
});

router.post("/userposttest", (req, res) => {
    const username = req.body.username;
    console.log(username);
    res.send("username: " + username);
});
 */

router.put("/:id", verifyTokenAndAuthorization, (req, res) => {
    // req.params.id is the supplied "/:id"
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt( req.body.password, process.env.PASSWORD_SECRET).toString();
    }

    User.findByIdAndUpdate(req.params.id, {
        // $set is a special mongo operator to copy all kv pairs in object to matching 
        // kv in our database
        $set: req.body
    }).then((result) => {
        // TODO: test basic behaviour of this promise in postman
        res.status(200).json("update complete: " + result);
    }).catch((error) => {
        res.status(500).json("update failed: " + error);
    })
})



module.exports = router