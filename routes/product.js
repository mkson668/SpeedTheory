// setup express router
const express = require("express");
const router = express.Router();
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const Product = require("../models/Product");

//CREATE product

router.post("/",verifyTokenAndAdmin, (req, res) => {
    const newProduct = new Product(
        {
            title: req.body.title,
            description: req.body.description,
            size: req.body.size,
            image: req.body.image,
            price: req.body.price,
            category: req.body.category,
            color: req.body.color
        }
    )
    newProduct.save().then((result) => {
        console.log("Product has been saved: " +  result);
        res.status(200).json(result);
    }).catch((error) => {
        console.log("Error has occured while saving product: " + error);
        res.status(500).json(error);
    })
})

module.exports = router