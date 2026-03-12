const express = require("express");
const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("working");
  next();
};

app.use(logger);

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});