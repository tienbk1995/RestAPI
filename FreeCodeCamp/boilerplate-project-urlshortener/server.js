require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./app");

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use("/api", router);

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
