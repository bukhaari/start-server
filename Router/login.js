const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const jwt = require("jsonwebtoken");

// Get secret key in .env
const SecretKey = process.env.SecretKey;

router.post("/", async (req, res) => {
  // destructuring req.body object
  const { email, password } = req.body;

  try {
    // looking on database this user is already exist.
    let user = await User.findOne({ email: email });
    if (!user) return res.status(400).send("Invalid email or password");

    // checking the password is valid
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    // delete password and __v
    const sendData = { ...user._doc };
    delete sendData.password;
    delete sendData.__v;

    // jenerate token
    const token = jwt.sign(sendData, SecretKey);
    res.send(token); // send token
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex);
    }
  }
});

module.exports = router;
