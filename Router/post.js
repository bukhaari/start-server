const DynamicDB = require("../Middleware/dynamicDb");
const { Customer } = require("../utils/AllCollection");
const PostSchema = require("../Models/post");
const CommentSchema = require("../Models/comment");
const admin = require("../Middleware/admin");
const auth = require("../Middleware/auth");
const express = require("express");
const router = express.Router();

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

router.post("/", [auth], async (req, res) => {
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
