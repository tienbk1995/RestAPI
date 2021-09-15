var express = require("express");
var app = express();
var router = express.Router();
const http = require("http");
const https = require("https");

let reqHeaders = {
  ipaddress: String,
  language: String,
  software: String,
};

const options = {
  hostname: "ipv4bot.whatismyipaddress.com",
  method: "GET",
};

const req = http
  .request(options, (res) => {
    console.log("statusCode: " + res.statusCode);
    for (var item in res.headers) {
      console.log(item + ": " + res.headers[item]);
    }
    res.on("data", function (chunk) {
      reqHeaders.ipaddress = chunk.toString();
      console.log("BODY: " + chunk);
    });
  })
  .end();

router.use((req, res) => {
  reqHeaders.language = req.get("accept-language");
  reqHeaders.software = req.get("user-agent");
  res.json(reqHeaders);
});

module.exports = router;
