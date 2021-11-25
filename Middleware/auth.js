const jwt = require("jsonwebtoken");

//getting secretkey in enviroemnt varianle
const SecretKey = process.env.SecretKey;

function auth(req, res, next) {
  // getting token in header
  const token = req.header("token");

  //checking token is provided or passing in header
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    // decoded token and checking if is InValid token this block exit and then catch block will be run automatic.
    const decoded = jwt.verify(token, SecretKey);
    user = decoded;
    next();
  } catch (ex) {
    // this statement will be run when token is Invalid.
    res.status(400).send("Invalid token");
  }
}

module.exports = auth;
