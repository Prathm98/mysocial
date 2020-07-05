const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(PORT, function () {
  console.log("Server started.");
});
