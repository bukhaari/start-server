const mongoose = require("mongoose");

function db_connection() {
  mongoose
    .connect("mongodb://localhost/defualt")
    .then(() => console.log("connected to Mongodb"))
    .catch(() => console.log("failed to connect Mongodb"));
}

module.exports = db_connection;
