const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const dashboard = {
    like: 30,
    followers: 250,
    following: 100,
    posts: 10,
  };

  res.send(dashboard);
});

module.exports = router;
