const mongoose = require("mongoose");

// Model prototype
class modelPrototype {
  constructor(username) {
    this.username = username;
    this._id = mongoose.Types.ObjectId().toString();
    this.logs = [];
  }
}

// Create new user API
const createUser = (username, callback, model) => {
  // Create document by instantiating user model
  const user = new model(new modelPrototype(username));
  // Save user to database
  user.save((err, data) => {
    callback(err, data);
  });
};

// Find all users
const findAllUser = (callback, model) => {
  const filter = {};
  const projection = { __v: false, logs: false };
  // Find all users from databse (eg: {_id: userId, username: username })
  model.find(filter, projection, (err, data) => {
    callback(err, data);
  });
};

// Update defined user
const updateUser = (userId, time, date, description, callback, model) => {
  // Filter user by userId
  const filter = { _id: userId };
  // Aggregation query to add logs object
  const aggregateUpdate = {
    $addToSet: {
      logs: {
        duration: time,
        date: date,
        description: description,
      },
    },
  };
  // Update user adding logs object
  model.updateOne(
    filter,
    aggregateUpdate,
    { strict: false }, // Options to override object has not existed before to db
    (err, data) => {
      callback(err, data); // Callback
    }
  );
};

// Find logs of each user
const findLogsUser = (userId, query, callback, model) => {
  // Aggregation query to find logs of given user
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
  // Find logs of given user
  model.aggregate(validateQuery(userId, query), (err, data) => {
    callback(err, data);
  });
};

// Validate query format
const validateQuery = (userId, query) => {
  let pipeline;
  // Aggregation query if query parameters are given (eg: from=yyyy-mm-dd&to=yyyy-mm-dd&limit=limitNumber)
  if (query.to && query.from && query.limit) {
    pipeline = [
      {
        $match: {
          _id: userId,
        },
      },
      { $unwind: "$logs" },
      {
        $match: {
          "logs.date": {
            $gte: new Date(query.from), // yyyy-mm-dd
            $lte: new Date(query.to), // yyyy-mm-dd
          },
        },
      },
      { $limit: parseInt(query.limit) },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          count: { $sum: 1 },
          logs: { $push: "$logs" },
        },
      },
      {
        $addFields: {
          from: query.from,
          to: query.to,
        },
      },
    ];
    // Aggregation for normal request
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
  return date;
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

module.exports.createUser = createUser;
module.exports.findAllUser = findAllUser;
module.exports.updateUser = updateUser;
module.exports.findLogsUser = findLogsUser;
module.exports.dateCheck = dateCheck;
module.exports.durationCheck = durationCheck;
module.exports.descriptionCheck = descriptionCheck;
