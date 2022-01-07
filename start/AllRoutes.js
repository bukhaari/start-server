const Author = require("../Router/Author");
const Customer = require("../Router/Customer");
const User = require("../Router/user");
const Login = require("../Router/login");
const Post = require("../Router/post");
const Dashboard = require("../Router/dashboard");
const express = require("express");
const bodyParser = require("body-parser");

function allRoutes(app) {
  app.use(express.json());
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());

  app.use("/api/author", Author);
  app.use("/api/customer", Customer);
  app.use("/api/login", Login);
  app.use("/api/post", Post);
  app.use("/api/user", User);
  app.use("/api/dashboard", Dashboard);
}

module.exports = allRoutes;
