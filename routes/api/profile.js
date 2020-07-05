const express = require('express');
const router = express.Router();

// @route     GET /profile
// @desc      Test route
// @access    Public
router.get("/", function (req, res) {
  res.send("Profile route.");
});

module.exports = router;
