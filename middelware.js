const express = require("express");
const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // go to next middleware/route
};

app.use(logger);

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(3000);