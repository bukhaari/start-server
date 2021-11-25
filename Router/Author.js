const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Author = mongoose.model("Author", authorSchema);

router.get("/", async (req, res) => {
  const authors = await Author.find().sort("name");
  res.send(authors);
});

router.get("/:id", async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) return res.status(404).send("Not found");
  res.send(author);
});

router.post("/", async (req, res) => {
  let author = new Author({
    name: req.body.name,
    age: req.body.age,
  });

  author = await author.save();

  res.send(author);
});

router.put("/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        age: req.body.age,
      },
      { new: true }
    );

    if (!author) return res.status(404).send("Not found");

    res.send(author);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  const author = await Author.findByIdAndRemove(req.params.id);
  if (!author)
    return res.status(404).send("The author the given Id was not found");

  res.send(author);
});

module.exports = router;
