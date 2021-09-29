const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongoApi = require("./mongodbAPIs");
const userModel = require("./model");

// Use body parser to encode form data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Post a new user with defined username
router.post("/users", (req, res, next) => {
  mongoApi.createUser(
    req.body.username,
    (err, data) => {
      if (err) {
        next(err);
      } else if (data) {
        res.status(200).send(data);
      }
    },
    userModel
  );
});

// Post a exercise to defined user
router.post("/users/:_id/exercises", (req, res, next) => {
  mongoApi.updateUser(
    req.params._id,
    mongoApi.durationCheck(req.body.duration),
    mongoApi.dateCheck(req.body.date),
    mongoApi.descriptionCheck(req.body.description),
    (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else if (data) {
        res.status(200).send(data);
      }
    },
    userModel
  );
});

// Get all users
router.get("/users", (req, res, next) => {
  mongoApi.findAllUser((err, data) => {
    if (err) {
      next(err);
    } else if (data) {
      res.status(200).send(data);
    }
  }, userModel);
});

// Get logs of the document
router.get("/users/:_id/logs", (req, res, next) => {
  mongoApi.findLogsUser(
    req.params._id,
    req.query,
    (err, data) => {
      if (err) {
        next(err);
      } else if (data) {
        res.status(200).send(data);
      }
    },
    userModel
  );
});

module.exports = router;
