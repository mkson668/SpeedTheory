// setup express router
const express = require("express");
const router = express.Router();
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");
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

// CREATE 

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
        // TODO: bug where promise result is not updated but database is updated
        res.status(200).json("update complete: " + result);
    }).catch((error) => {
        res.status(500).json("update failed: " + error);
    })
})

// DELETE

router.delete("/:id", verifyTokenAndAuthorization, (req, res) => {
    User.findByIdAndDelete(req.params.id).then((result) => {
        res.status(200).json("user successfully deleted: " + result);
    }).catch((error) => {
        res.status(500).json("user delete error: " + error);
    })
})

// READ 

router.get("/:id", verifyTokenAndAdmin, (req, res) => {
    // only admin should be able to get all users
    User.findById(req.params.id).then((result) => {

        // should not expose password to browser
        const {password, ...others} = result._doc;
            
        // destructure cause mongo is wrap it in _doc
        res.status(200).json({...others});
    }).catch((error) => {
        res.status(500).json("user delete error: " + error);
    })
})



module.exports = router