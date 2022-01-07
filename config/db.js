const mongoose = require("mongoose");

function db_connection() {
  let url = process.env.DEV_URL;

  if (process.env.NODE_ENV === "production") url = process.env.PRO_URL;

  mongoose
    .connect(url)
    .then(() => console.log("connected to Mongodb"))
    .catch(() => console.log("failed to connect Mongodb"));
}

module.exports = db_connection;
