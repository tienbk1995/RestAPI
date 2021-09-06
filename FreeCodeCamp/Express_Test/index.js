var express = require("express");
var birds = require("./app");
var app = express();
app.use("/route", birds);
// router.use("/", birds);
const listener = app.listen(process.env.PORT || 8000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
