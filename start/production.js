const cors = require("cors");
const path = require("path");

function Production(app) {
  app.use(cors());

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
  } else {
    app.get("/", (req, res) => {
      const api = [
        {
          name: "post",
          url: "http://localhost:5000/api/post",
          fields: [
            { name: "text", type: "string", required: "true", des: "" },
            {
              name: "postedBy",
              type: "id",
              required: "true",
              des: "user id who is post",
            },
            { name: "image", type: "image", required: "false", des: "" },
          ],
        },
        { name: "user", url: "http://localhost:5000/api/user", fields: [] },
      ];

      res.send({about:"welcome to project, this project is social media backend api", api:api});
    });
  }
}

module.exports = Production;
