// setup express webserver
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/authentication");
const productRoute = require("./routes/product");

// setup dotenv only need to do this once, we can now use process.env. anywhere
dotenv.config()

mongoose.connect(process.env.MONGODB_URL).then((result) => {
    console.log("Database connection successful");
}).catch((err) => {
    console.log("error has occurred for database connection: " + err);
});;

// to enable json reading for express
app.use(express.json());

// hooking up router endpoint ex: lh:5000/api/user/usertest
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("backend server has started");
});