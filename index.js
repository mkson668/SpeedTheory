// setup express webserver
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config()

mongoose.connect(process.env.MONGODB_URL).then((result) => {
    console.log("Database connection successful");
}).catch((err) => {
    console.log("error has occurred for database connection: " + err);
});;

app.listen(process.env.PORT || 5000, () => {
    console.log("backend server has started");
});