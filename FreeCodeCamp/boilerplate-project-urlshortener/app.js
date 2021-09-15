const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const shortid = require("shortid");
const https = require("https");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const dns = require("dns");

const options = {
  family: 4,
};

const lookupDNS = (url, callback) => {
  url = url.split("//");
  dns.lookup(url[1], options, (err, address, family) => {
    callback(err, address, family);
  });
};

function generateRandomInteger(max) {
  return Math.floor(Math.random() * max) + 1;
}

// Establish mongo database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connection is ready");
  })
  .catch((err) => {
    console.error(err);
  });

const urlSchema = new Schema({
  original_url: String,
  short_url: Number,
});

const urlModel = mongoose.model("Url", urlSchema);

const createUrl = (callback) => {
  const newUrl = new urlModel({
    original_url: formData.original_url,
    short_url: formData.short_url,
  });
  newUrl.save((err, data) => {
    callback(err, data);
  });
};

const validateExistingUrl = (url, callback) => {
  urlModel.findOne({ original_url: url }, (err, data) => {
    callback(err, data);
  });
};

const validateExistingShortUrl = (id, callback) => {
  urlModel.findOne({ short_url: id }, (err, data) => {
    callback(err, data);
  });
};

const removeExistingUrl = (id, callback) => {
  urlModel.findOneAndRemove({ short_url: id }, (err, data) => {
    callback(err, data);
  });
};
const validateSyntax = (url) => {
  const pattern = /(https?|ftp):\/{1,2}([a-zA-Z0-9-]*\.)*(com|vn|org)$/g;
  return url.match(pattern);
};

const updateformData = (url) => {
  formData.original_url = url;
  formData.short_url = generateRandomInteger(5000);
};

const formData = {
  original_url: String,
  short_url: Number,
};

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({ extended: true }));

router.post("/shorturl", (req, res, next) => {
  console.log(req.body.url);
  validateExistingUrl(req.body.url, (err, data) => {
    if (err) {
      return next(err);
    } else if (data) {
      console.log("This URL has already been registered");
      return res.status(404).send({ Id_Existed: data.short_url });
    } else {
      console.log("URL hasn't been in database yet, starting to validate..");
      lookupDNS(req.body.url, (err, address, family) => {
        if (address) {
          updateformData(req.body.url);
          createUrl((err, data) => {
            if (err) {
              res.status(404).send(err);
            }
            console.log("URL has been added into database");
            res.status(201).send(formData);
          });
        } else {
          console.log("Invalid Hostname");
          res.status(404).send({ error: "Invalid Hostname" });
        }
      });
    }
  });
});

router.get("/shorturl/:code", (req, res, next) => {
  validateExistingShortUrl(req.params.code, (err, data) => {
    if (err) {
      return next(err);
    } else if (data) {
      console.log("Start redirect to this URL");
      res.redirect(data.original_url);
    } else {
      res.send({ short_url: "This URL has not existed yet" });
    }
  });
});

router.get("/shorturl/remove/:code", (req, res, next) => {
  removeExistingUrl(req.params.code, (err, data) => {
    if (err) {
      return next(err);
    } else if (data) {
      console.log("Start remove this URL");
      res
        .status(200)
        .send("'" + data.original_url + "'" + " being removed successfully");
    } else {
      res.send({ short_url: "This URL has not existed yet" });
    }
  });
});

module.exports = router;
