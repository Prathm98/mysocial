const express = require('express');
const router = express.Router();

// @route     GET /users
// @desc      Test route
// @access    Public
router.get("/", function (req, res) {
  res.send("Users route.");
});

module.exports = router;
