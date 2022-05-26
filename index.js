// setup express webserver
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://admin:afp8vwtamk@clusterfree.a8sal.mongodb.net/stshop?retryWrites=true&w=majority"
).then((result) => {
    console.log("Database connection successful");
}).catch((err) => {
    console.log("error has occurred for database connection: " + err);
});;

app.listen(5000, () => {
    console.log("backend server has started");
});