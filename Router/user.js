const User = require("../Models/user");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

//--------Multer Configration ---------//
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const newFileName = file.originalname.split(".")[0];
    const fileType = file.mimetype.split("/")[1];
    cb(null, newFileName + new Date().getTime() + "." + fileType);
  },
});

const upload = multer({ storage: storage });
//--------------- End of Multer--------------//

//Getting secretkey in env
const SecretKey = process.env.SecretKey;

router.post("/", upload.single("avatar"), async (req, res) => {
  try {
    // destructuring req.boy object
    const { email, name, password } = req.body;

    // looking on database this user is already exist?
    const getUser = await User.findOne({ email: email });

    // checking user is Already
    if (getUser) return res.status(400).send("user is Already registred");

    // get avatar in file
    const avatar = req.file ? req.file.path : "uploads\\default.png";

    // new data from req.body object destructuring
    let newUser = {
      name,
      email,
      password, //122333
      avatar,
    };

    // generate salt
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

router.put("/:id", upload.single("avatar"), async (req, res) => {
  try {
    // lookin this user is already in db.
    const getUser = await User.findById(req.params.id);

    //checking is already
    if (!getUser) return res.status(404).send("Data was not found");

    // get avatar in file. check the file has path.
    const avatar = req.file ? req.file.path : "uploads\\default.png";

    // prepare object of up data data.
    const newData = { ...req.body, avatar };

    // delete old image. if is not equal default.
    if (getUser.avatar !== "uploads\\default.png") {
      fs.unlink(getUser.avatar, function (err) {
        if (err) return console.log(err);

        // if no error, file has been deleted successfully
        console.log("File deleted!");
      });
    }

    const result = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: newData,
      },
      {
        new: true,
      }
    );

    res.send(result);
  } catch (ex) {
    for (feild in ex.errors) res.status(400).json(ex.errors[feild].message);
  }
});

module.exports = router;
