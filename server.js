const db_connection = require("./config/db");
const express = require("express");
require("dotenv").config();
const app = express();

//All routes app
require("./start/AllRoutes")(app);

// global uploads file images and files.
app.use("/uploads", express.static("uploads"));

// connection mongodb
db_connection();

const port = process.env.PORT;
app.listen(port, () =>
  console.log(`Server start on port http://localhost:${port}`)
);
