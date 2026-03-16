const express = require("express");
const cors = require("cors");
const app = express();


app.use(express.json());
app.use(cors());
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("working");
  next();
};

app.use(logger);

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.get("/about", (req, res) => {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);
  const sum = a + b;
  res.send(`The sum of ${a} and ${b} is ${sum}`);
});

app.post("/sum", (req, res) => {
  const a = parseInt(req.body.a);
  const b = parseInt(req.body.b);
  res.json({ sum: a + b });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});