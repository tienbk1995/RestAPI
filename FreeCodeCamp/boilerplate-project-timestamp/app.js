var express = require("express");
var app = express();
var router = express.Router();

let timeStamp = {
  unix: Number,
  utc: String,
};

let dateFormat = {
  year: String,
  month: String,
  day: String,
  hour: String,
  minute: String,
  second: String,
};

function updateTimeStamp(validate, requestPara) {
  const date = new Date(
    Date.UTC(
      dateFormat.year,
      dateFormat.month,
      dateFormat.day,
      dateFormat.hour,
      dateFormat.minute,
      dateFormat.second
    )
  );
  timeStamp.utc = date.toUTCString();
  if (
    validate === "ISODATE" ||
    validate === "SHORTDATE" ||
    validate === "LONGDATE"
  ) {
    timeStamp.unix = parseInt(Date.parse(date));
  } else if (validate === "UNIX") {
    timeStamp.unix = parseInt(requestPara);
  }
  return timeStamp;
}

function handleUnixFormat(validate, requestPara) {
  let format = new Date(parseInt(requestPara));
  let ymdType = format.toLocaleDateString("en-US"); // year - month - day
  console.log(ymdType);
  let hmsType = format.toLocaleTimeString("en-GB"); // hour - minute - second
  console.log(hmsType);
  ymdType = ymdType.split("/"); // mm-dd-yy
  hmsType = hmsType.split(":"); // hh-mm-ss
  dateFormat.year = ymdType[2];
  dateFormat.month = ymdType[0] - 1;
  dateFormat.day = ymdType[1];
  dateFormat.hour = "0";
  dateFormat.minute = "0";
  dateFormat.second = "0";
}

function validation(requestPara) {
  if (validateUnix(requestPara) == "UNIX") return "UNIX";
  if (validateISODate(requestPara) == "ISODATE") return "ISODATE";
  if (validateShortDate(requestPara) == "SHORTDATE") return "SHORTDATE";
  if (validateLongDate(requestPara) == "LONGDATE") return "LONGDATE";
  return "INVALID";
}

function validateUnix(requestPara) {
  let format = requestPara.match(/\D/g); // Match any words
  if (!format) {
    return "UNIX";
  }
  return "INVALID";
}

function validateISODate(requestPara) {
  let format = requestPara.split("-");
  if (!format[0].match(/^(\d{4})$/g)) return "INVALID";
  if (!format[1].match(/^(\d{2})$/g)) return "INVALID";
  if (!format[2].match(/^(\d{2})$/g)) return "INVALID";
  dateFormat.year = format[0];
  dateFormat.month = format[1] - 1;
  dateFormat.day = format[2];
  dateFormat.hour = "0";
  dateFormat.minute = "0";
  dateFormat.second = "0";
  return "ISODATE";
}

function validateShortDate(requestPara) {
  let format = requestPara.split("/");
  if (!format[0].match(/^(\d{2})$/g)) return "INVALID";
  if (!format[1].match(/^(\d{2})$/g)) return "INVALID";
  if (!format[2].match(/^(\d{4})$/g)) return "INVALID";
  dateFormat.month = format[0] - 1;
  dateFormat.day = format[1];
  dateFormat.year = format[2];
  dateFormat.hour = "0";
  dateFormat.minute = "0";
  dateFormat.second = "0";
  return "SHORTDATE";
}

function validateLongDate(requestPara) {
  let format = requestPara.split(" ");
  if (!format[0].match(/^(\d{2})$/g)) return "INVALID";
  if (!format[1].match(/^([a-zA-Z]{3})$/g)) return "INVALID";
  if (!format[2].match(/^(\d{4})$/g)) return "INVALID";
  dateFormat.day = format[0];
  dateFormat.month = convertToMonth(format[1]) - 1;
  dateFormat.year = format[2];
  dateFormat.hour = "0";
  dateFormat.minute = "0";
  dateFormat.second = "0";
  return "LONGDATE";
}

function convertToMonth(monthName) {
  let listMonths = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };
  return listMonths[monthName];
}

router.get("/:date?", (req, res) => {
  let timeStamp;
  if (req.params.date) {
    const validate = validation(req.params.date);
    // console.log(validate);
    if (
      validate === "ISODATE" ||
      validate === "SHORTDATE" ||
      validate === "LONGDATE"
    ) {
      timeStamp = updateTimeStamp(validate, req.params.date);
    } else if (validate === "UNIX") {
      handleUnixFormat(validate, req.params.date);
      timeStamp = updateTimeStamp(validate, req.params.date);
    } else {
      res.json({ error: "Invalid Date" });
    }
    res.json(timeStamp);
  } else {
    const now = new Date();
    res.json({ unix: parseInt(Date.parse(now)), utc: now.toUTCString() });
  }
});

module.exports = router;
