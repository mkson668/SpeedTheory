const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeaderToken = req.headers.token;
    if (authHeaderToken) {
        // jwt tokens contain the word "bearer" we split by empty space and take second element in array
        const tokenSpliced = authHeaderToken.split(" ")[1];
        jwt.verify(tokenSpliced, process.env.JWT_SECRET, (error, data) => {
            if (error) {
                return res.status(403).json("token is not valid");
            }
            req.user = data;
            // next() simply means continue in the original function you called this function from
            return next();
        });
    } else {
        return res.status(401).json("you are not authenticated");
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            // next() simply means to jump out of the callback, back to original place you called it
            return next();
        } else {
            res.status(403).json("authentication failed");
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            // next() simply means to jump out of the callback, back to original place you called it
            return next();
        } else {
            res.status(403).json("authentication failed");
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};