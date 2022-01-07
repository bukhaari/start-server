const express = require("express");
require("dotenv").config();
const app = express();

// production middlewarres
require("./start/production")(app);

//All routes app
require("./start/AllRoutes")(app);

// global uploads file images and files.
app.use("/uploads", express.static("uploads"));

// connection mongodb
require("./config/db")();

// set Port
require("./config/port")(app);
