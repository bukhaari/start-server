const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

// userSchema.methods.generateAuthToken = function () {
//
//   return token;
// };

const CommentModel = mongoose.model("Comments", commentSchema);

// module.exports = userSchema;
module.exports = CommentModel;
