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

// Update

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

// READ  get one user

// for testing set one user to isAdmin:true in database manually
router.get("/find/:id", verifyTokenAndAdmin, (req, res) => {
    // only admin should be able to get all users
    User.findById(req.params.id).then((result) => {

        // should not expose password to browser
        const {password, ...others} = result._doc;
            
        // destructure cause mongo is wrap it in _doc
        res.status(200).json(others);
    }).catch((error) => {
        res.status(500).json("user delete error: " + error);
    })
})

// READ get al users

// for testing set one user to isAdmin:true in database manually
router.get("/findAll", verifyTokenAndAdmin, (req, res) => {
    // only admin should be able to get all users
    // add ?new=true parameter for retrieving only new users
    const newUsersOnly = req.query.new;
    if (newUsersOnly) {
        User.find().then((result) => {
            const usersWOPassword = [];
            for (const user of result) {
                const {password, ...others} = user._doc;
                usersWOPassword.push(others);
            }
                
            // destructure cause mongo is wrap it in _doc
            //usersWOPassword.sort({username: -1}).limit(10);
            usersWOPassword.sort((a, b) => b.username - a.username);
            res.status(200).json(usersWOPassword.slice(0,5));
        }).catch((error) => {
            res.status(500).json("user delete error: " + error);
        })
    } else {
        User.find().then((result) => {
            const usersWOPassword = [];
            for (const user of result) {
                const {password, ...others} = user._doc;
                usersWOPassword.push(others);
            }
                
            // destructure cause mongo is wrap it in _doc
            res.status(200).json(usersWOPassword);
        }).catch((error) => {
            res.status(500).json("user delete error: " + error);
        })
    }
    
})

// GET user statistics
router.get("/stats", verifyTokenAndAdmin, (req, res) => {
    const date = new Date();
    // set to year ago
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1, lastYear.getMonth());

    User.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: lastYear
                }
            }
        },
        {
            $project: {
                month: {
                    $month: "$createdAt"
                }
            }
        },
        {
            $group: {
                _id: "$month",
                total: {$sum: 1}
            }
        }
    ]).then((data) => {
        console.log("retrieving data from DB");
        res.status(200).json(data);
    }).catch((error) => {
        res.status(500).json("error with stats retrieval: " + error);
    })
})



module.exports = router