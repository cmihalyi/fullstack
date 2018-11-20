const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");

const API_PORT = process.env.port || 3001;
const app = express();

// this is our MongoDB database
const dbRoute = "mongodb://db_user:db_password1@ds145563.mlab.com:45563/divvy";

// connects our back end code with the database
mongoose.connect(dbRoute, {useNewUrlParser: true});
let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(logger("dev"));
app.use(express.static('client'));
app.use(bodyParser.json());
app.use("/api", require("./routes/api"));

//error handling middleware
app.use((err, req, res, next) => {
    console.log(err);
    res.status(422).send({error: err.message});

});

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
