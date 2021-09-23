const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Schema } = mongoose;
const castAggregation = require("mongoose-cast-aggregation");

// Use body parser to encode form data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
mongoose.plugin(castAggregation);

// Connect mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connection successful"))
  .catch((err) => console.error("Connection failed"));

// Set up mongo user schema
const userSchema = new Schema({
  username: String,
  _id: String,
  logs: [Object],
});

// Set up mongo user model
const userModel = new mongoose.model("user", userSchema);

// Create new user API
const createUser = (username, callback) => {
  // Create document by instantiating user model
  const user = new userModel({
    username: username,
    _id: mongoose.Types.ObjectId().toString(),
    logs: [],
  });
  user.save((err, data) => {
    callback(err, data);
  });
};

// Find all users
const findAllUser = (callback) => {
  const filter = {};
  const projection = { __v: false, logs: false };
  userModel.find(filter, projection, (err, data) => {
    callback(err, data);
  });
};

// Update defined user
const updateUser = (userId, time, date, description, callback) => {
  const filter = { _id: userId };
  const aggregateUpdate = {
    $addToSet: {
      logs: {
        duration: time,
        date: date,
        description: description,
      },
    },
  };
  userModel.updateOne(
    filter,
    aggregateUpdate,
    { strict: false }, // Options
    (err, data) => {
      // Callback
      callback(err, data);
    }
  );
};

// Find logs of each user
const findLogsUser = (userId, query, callback) => {
  const pipeline = [
    { $match: { _id: userId } },
    {
      $project: {
        username: true,
        _id: true,
        logs: true,
        count: { $size: "$logs" },
      },
    },
  ];
  userModel.aggregate(validateQuery(userId, query), (err, data) => {
    callback(err, data);
  });
};

// Validate query format
const validateQuery = (userId, query) => {
  let pipeline;
  if (query.to && query.from && query.limit) {
    pipeline = [
      { $match: { _id: userId } },
      { $unwind: "$logs" },
      {
        $group: {
          _id: "$logs.date",
        },
      },
      {
        $match: {
          _id: {
            $gt: new Date(query.from).toDateString(), // yyyy-mm-dd
            $lt: new Date(query.to).toDateString(), // yyyy-mm-dd
          },
        },
      },
      { $limit: parseInt(query.limit) },
      {
        $project: {
          username: true,
          _id: true,
          // logs: true,
          // count: { $size: "$logs" },
        },
      },
    ];
  } else {
    pipeline = [
      { $match: { _id: userId } },
      {
        $project: {
          username: true,
          _id: true,
          logs: true,
          count: { $size: "$logs" },
        },
      },
    ];
  }
  return pipeline;
};

// Validate date format
Date.prototype.isValid = function () {
  // An invalid date object returns NaN for getTime() and NaN is the only
  // object not strictly equal to itself.
  return this.getTime() === this.getTime();
};

// Validate date input
const dateCheck = (date) => {
  date = new Date(date);
  if (!date.isValid()) {
    date = new Date();
  }
  return date.toDateString();
};

// Validate duration input
const durationCheck = (duration) => {
  let error = new Error("Path `duration` is required.");
  if (duration) {
    return parseInt(duration);
  }
  throw error;
};

// Validate description input
const descriptionCheck = (description) => {
  let error = new Error("Path `description` is required.");
  if (description) {
    return description;
  }
  throw error;
};

// Post a new user with defined username
router.post("/users", (req, res, next) => {
  createUser(req.body.username, (err, data) => {
    if (err) {
      next(err);
    } else if (data) {
      res.status(200).send(data);
    }
  });
});

// Post a exercise to defined user
router.post("/users/:_id/exercises", (req, res, next) => {
  updateUser(
    req.params._id,
    durationCheck(req.body.duration),
    dateCheck(req.body.date),
    descriptionCheck(req.body.description),
    (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else if (data) {
        res.status(200).send(data);
      }
    }
  );
});

// Get all users
router.get("/users", (req, res, next) => {
  findAllUser((err, data) => {
    if (err) {
      next(err);
    } else if (data) {
      res.status(200).send(data);
    }
  });
});

// Get logs of the document
router.get("/users/:_id/logs", (req, res, next) => {
  // console.log(req.query);
  findLogsUser(req.params._id, req.query, (err, data) => {
    if (err) {
      next(err);
    } else if (data) {
      res.status(200).send(data);
    }
  });
});

module.exports = router;
