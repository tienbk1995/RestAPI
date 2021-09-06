const express = require("express");
const Joi = require("joi");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "Course1" },
  { id: 2, name: "Course2" },
  { id: 3, name: "Course3" },
];
// GET Request Handler
app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.get("/api/course", (req, res) => {
  res.send(courses);
});

app.get("/api/posts/:id", (req, res) => {
  res.send(req.query);
});

// POST Request Handler
app.post("/api/course", (req, res) => {
  // Validate
  const { error } = validateCourse(req);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

// PUT Request Handler
app.put("/api/course/:id", (req, res) => {
  // Look up
  const course = lookUpCourse(req);
  if (!course) {
    return res
      .status(404)
      .send(`The requested ID:${req.params.id} is not found`);
  }
  // Validate
  const { error } = validateCourse(req);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Update - response
  course.name = req.body.name;
  res.send(course);
});

// DELETE Request Handler
app.delete("/api/course/:id", (req, res) => {
  //Look up
  const course = lookUpCourse(req);
  if (!course) {
    return res
      .status(404)
      .send(`The requested ID:${req.params.id} is not found`);
  }
  // Delete - response
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(`The ID:${req.params.id} was successfully deleted`);
});

// Look up utity
function lookUpCourse(req) {
  return courses.find((c) => c.id === parseInt(req.params.id));
}

// Validation utity
function validateCourse(req) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(req.body, schema);
}

const port = process.env.PORT || 3000; // Port defined
app.listen(port, () => console.log(`Listening on port ${port}...`)); // Listening on host
