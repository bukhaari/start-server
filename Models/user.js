const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// userSchema.methods.generateAuthToken = function () {
//
//   return token;
// };

const UserModel = mongoose.model("Users", userSchema);

// module.exports = userSchema;
module.exports = UserModel;
