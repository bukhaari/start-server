const User = require("../Models/user");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

//Getting secretkey in env
const SecretKey = process.env.SecretKey;

router.post("/", async (req, res) => {
  // destructuring req.boy object
  const { email, name, password } = req.body;

  try {
    // looking on database this user is already exist?
    const getUser = await User.findOne({ email: email });

    // checking user is Already
    if (getUser) return res.status(400).send("user is Already registred");

    // new data from req.body object destructuring
    let newUser = {
      name,
      email,
      password,
    };

    // Jenerate salt
    const salt = await bcrypt.genSalt(10);
    //hashing password and update newuser object
    newUser.password = await bcrypt.hash(password, salt);
    //schema user
    const user = new User(newUser);

    // saving new user
    const result = await user.save();

    //cloning new result user and delete password
    let sendData = { ...result._doc };
    delete sendData.password;
    delete sendData.__v;

    //Janerate token
    const token = jwt.sign(sendData, SecretKey);

    // send token in header and send data
    res.header("token", token).send(sendData);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
      res.send(ex.errors[field].message);
    }
  }
});

module.exports = router;
