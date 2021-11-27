const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    image: {
      type: Array,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "Tell who is Created this post?"],
    },
    like: {
      amount: { type: Number, default: 0 },
      likeBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
      ],
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
  },
  { timestamps: true }
);

// userSchema.methods.generateAuthToken = function () {
//
//   return token;
// };

const PostModel = mongoose.model("Posts", postSchema);

// module.exports = userSchema;
module.exports = PostModel;
