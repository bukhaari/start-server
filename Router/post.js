const DynamicDB = require("../Middleware/dynamicDb");
const { Customer } = require("../utils/AllCollection");
const PostSchema = require("../Models/post");
const CommentSchema = require("../Models/comment");
const admin = require("../Middleware/admin");
const auth = require("../Middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await PostSchema.find()
    .populate({ path: "comments" })
    .populate({
      path: "comments",
      populate: { path: "commentBy", select: { name: 1, _id: 0 } },
    });
  res.send(posts);
});

router.post("/", [auth], async (req, res) => {
  const newData = {
    text: req.body.text,
    postedBy: user._id,
  };

  const newModel = PostSchema(newData);
  const result = await newModel.save();

  res.send(result);
});

router.post("/comment", [auth], async (req, res) => {
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
});

module.exports = router;
