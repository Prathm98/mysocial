const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

// Define Routes
app.use('/users', require('./routes/api/users'));
app.use('/profile', require('./routes/api/profile'));
app.use('/auth', require('./routes/api/auth'));
app.use('/posts', require('./routes/api/posts'));

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(PORT, function () {
  console.log("Server started.");
});
