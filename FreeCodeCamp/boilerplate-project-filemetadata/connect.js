const mongoose = require("mongoose");
require("dotenv").config(); // for using .env file

const connectionDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connect successfully"))
    .catch((err) => console.log("Connect successfully" + err.message));
};

module.exports.toConnect = connectionDatabase;
