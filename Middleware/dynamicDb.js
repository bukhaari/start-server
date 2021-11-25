const mongoose = require("mongoose");

function dynamicDB(req, res, next) {
  try {
    //getting data in header
    const AccessDB = req.header("AccessDB");
    if (!AccessDB) return res.send("No db provided in header");

    // passing database onther routes
    Database = mongoose.connection.useDb(AccessDB);
    next();
  } catch (ex) {
    res.status(400).send("Invalid Db");
  }
}

module.exports = dynamicDB;
