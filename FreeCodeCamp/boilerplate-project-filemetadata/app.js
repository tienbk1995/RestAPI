const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const connectMongodb = require("./connect");
const fileModel = require("./model");
const multer = require("multer");
const upload = multer({ dest: "C:\\Users\\anhhu\\Desktop\\dest" });
const fs = require("fs");
const rf = fs.readFileSync;
const buffer = require("buffer");

let myImage;
// Response file properties
class FileProperties {
  constructor(name, type, size) {
    this.name = name;
    this.type = type;
    this.size = size;
  }
}

// Use body parser to encode form data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Connecting database
connectMongodb.toConnect();

// Create new user API
const uploadFile = (requestedFile, encode_image, model, callback) => {
  // Create document by instantiating file model
  const file = new model({
    contentType: requestedFile.mimetype,
    image: new Buffer(encode_image, "base64"),
  });
  // Save user to database
  file.save((err, data) => {
    callback(err, data);
  });
};

const findOne = (fileId, model, callback) => {
  model.findOne({ _id: Object(fileId) }, (err, data) => {
    callback(err, data);
  });
};

router.post("/fileanalyse", upload.single("upfile"), (req, res, next) => {
  let img = rf(req.file.path);
  let encode_image = img.toString("base64");
  const fileResponse = new FileProperties(
    req.file.originalname,
    req.file.mimetype,
    req.file.size
  );
  uploadFile(req.file, encode_image, fileModel, (err, data) => {
    if (err) {
      next(err);
    }
    if (data) {
      res.status(200).send(fileResponse);
    }
  });
});

router.get("/fileanalyse/:id", (req, res, next) => {
  findOne(req.params.id, fileModel, (err, data) => {
    if (err) {
      next(err);
    }
    if (data) {
      myImage = data.image.buffer;
      res.redirect("/api/imageFound");
      // res.send(data);
      // res.contentType("image/jpeg");
      // res.send(data.image.buffer);
    }
  });
});

router.get("/imageFound", (req, res, next) => {
  res.contentType("image/jpeg");
  res.send(myImage);
});
module.exports = router;
