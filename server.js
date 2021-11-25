const db_connection = require("./config/db");
const express = require("express");
require("dotenv").config();
const app = express();

//All routes app
require("./start/AllRoutes")(app);

// connection mongodb
db_connection();

const port = process.env.PORT;
app.listen(port, () =>
  console.log(`Server start on port http://localhost:${port}`)
);
