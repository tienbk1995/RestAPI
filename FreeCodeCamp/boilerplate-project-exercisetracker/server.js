const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const router = require("./routerAPIs");
const mongodbConnection = require("./dbconnect");

// Connecting mongo database
mongodbConnection.toConnect();

// Legacy configuration
app.use(cors());
app.use(express.static("public"));

// Connect to router
app.use("/api", router);

// Return html template to client side
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

//Listen on local host (loopback host)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
