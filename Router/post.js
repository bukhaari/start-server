const DynamicDB = require("../Middleware/dynamicDb");
const { Customer } = require("../utils/AllCollection");
const PostSchema = require("../Models/post");
const CommentSchema = require("../Models/comment");
const admin = require("../Middleware/admin");
const auth = require("../Middleware/auth");
const express = require("express");
const router = express.Router();

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

//@GET API: of tweet posts --> api/post
router.get("/", async (req, res) => {
  try {
    const posts = await PostSchema.find()
      .populate({ path: "postedBy", select: { name: 1 } })
      .populate({ path: "comments" })
      .populate({
        path: "comments",
        populate: { path: "commentBy", select: { name: 1 } },
      })
      .populate({
        path: "like",
        populate: { path: "likeBy", select: { name: 1 } },
      });
    res.send(posts);
  } catch (ex) {
    for (feild in ex.errors) {
      res.status(400).send(ex.errors[feild].message);
      console.log(ex.errors[feild].message);
    }
  }
});

//@POST API: of tweet post --> api/post
router.post("/", upload.single("image"), [auth], async (req, res) => {
  try {
    const newData = {
      text: req.body.text,
      postedBy: user._id,
    };

    const newModel = PostSchema(newData);
    const result = await newModel.save();

    res.send(result);
  } catch (ex) {
    for (feild in ex.errors) {
      res.status(400).send(ex.errors[feild].message);
      console.log(ex.errors[feild].message);
    }
  }
});

//@POST API: of comments --> api/post/comment
router.post("/comment", [auth], async (req, res) => {
  try {
    const newData = {
      text: req.body.text,
      commentBy: req.body.commentById,
    };

    const newModel = CommentSchema(newData);
    const comment = await newModel.save();

    const postId = req.body.postId;
    await PostSchema.findByIdAndUpdate(postId, {
      $addToSet: { comments: [comment._id] },
    });

    res.send({ ...comment._doc, postId });
  } catch (ex) {
    for (feild in ex.errors) {
      res.status(400).send(ex.errors[feild].message);
      console.log(ex.errors[feild].message);
    }
  }
});

//@PUT API: of like --> api/post/like
router.put("/like", [auth], async (req, res) => {
  try {
    const postId = req.body.postId;
    const likeBy = req.body.likeBy;
    await PostSchema.findByIdAndUpdate(postId, {
      $inc: { "like.amount": 1 },
      $addToSet: { "like.likeBy": likeBy },
    });

    res.send(201);
  } catch (ex) {
    for (feild in ex.errors) {
      res.status(400).send(ex.errors[feild].message);
      console.log(ex.errors[feild].message);
    }
  }
});

module.exports = router;
