const Author = require("../Router/Author");
const Customer = require("../Router/Customer");
const User = require("../Router/user");
const Login = require("../Router/login");
const express = require("express");

function allRoutes(app) {
  app.use(express.json());
  app.use("/api/author", Author);
  app.use("/api/customer", Customer);
  app.use("/api/user", User);
  app.use("/api/login", Login);

  //main route
  app.get("/", (req, res) => {
    res.send("Welcome to Project");
  });
}

module.exports = allRoutes;
