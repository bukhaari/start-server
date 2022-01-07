const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const auth = require("../Middleware/auth");
const CommentSchema = require("../Models/comment");
const ObjectId = require("mongoose").Types.ObjectId;
const PostModel = require("../Models/post");

//@GET API: of tweet posts --> api/post
router.get("/", async (req, res) => {
  try {

    const posts = await PostModel.find()
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
router.post("/", upload.array("image"), [auth], async (req, res) => {
  try {
    // copy files in new variable.
    const fileImage = req.files;
    // get image path in fileImage array.
    const pathImages = fileImage.map((image) => image.path);

    const newData = {
      text: req.body.text,
      postedBy: user._id,
      image: req.files ? pathImages : [],
    };

    const newModel = PostModel(newData);
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
    await PostModel.findByIdAndUpdate(postId, {
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
    const likebyId = req.body.likeBy;

    // get post in db
    const posts = await PostModel.find({ _id: postId });

    //checking this user is already liked. isLiked: true or false
    const [isLiked] = posts.map((p) =>
      // likeBy is an array of ids.
      p.like.likeBy.includes(ObjectId(likebyId))
    );

    // checking is true, if true decrease like amount and delete the user of liked by post.
    if (isLiked) {
      await PostModel.findByIdAndUpdate(postId, {
        $inc: { "like.amount": -1 },
        $pull: { "like.likeBy": likebyId },
      });

      return res.send({
        text: "unLiked",
        success: true,
        statusCode: 204,
      });
    }

    //if isLiked is not true, increase like amount and add the user of liked by post.
    await PostModel.findByIdAndUpdate(postId, {
      $inc: { "like.amount": 1 },
      $addToSet: { "like.likeBy": likebyId },
    });

    res.send({ text: "liked", success: true, statusCode: 201 });
  } catch (ex) {
    for (feild in ex.errors) {
      res.status(400).send(ex.errors[feild].message);
      console.log(ex.errors[feild].message);
    }
  }
});

module.exports = router;
