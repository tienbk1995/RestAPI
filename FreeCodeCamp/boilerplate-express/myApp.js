var express = require("express");
var app = express();
var bodyParser = require("body-parser");

const absolutePath = __dirname + "/views/index.html";
let crrTime;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/name", (req, res) => {
  const { first, last } = req.body;
  res.json({ name: first + " " + last });
});

app.use((req, res, next) => {
  var string = req.method + " " + req.path + " - " + req.ip;
  console.log(string);
  next();
});

app.get(
  "/now",
  (req, res, next) => {
    crrTime = new Date().toString();
    console.log(crrTime);
    next();
  },
  (req, res) => {
    res.json({ time: crrTime });
  }
);

app.get("/", (req, res) => {
  var string = req.method + " " + req.path + " - " + req.ip;
  console.log(string);
  res.sendFile(absolutePath);
});

app.use("/public", express.static(__dirname + "/public"));

app.get("/json", (req, res) => {
  if (process.env.MESSAGE_STYLE === "uppercase")
    res.json({ message: "HELLO JSON" });
  res.json({ message: "Hello json" });
});

app.get("/:word/echo", (req, res) => {
  res.json({ echo: req.params.word });
});

app.get("/name", (req, res) => {
  const { first, last } = req.query;

  res.json({ name: first + " " + last });
});

module.exports = app;
