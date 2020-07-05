const express = require('express');
const router = express.Router();

// @route     GET /posts
// @desc      Test route
// @access    Public
router.get("/", function (req, res) {
  res.send("Posts route.");
});

module.exports = router;
