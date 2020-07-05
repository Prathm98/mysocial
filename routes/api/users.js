const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route     GET /users
// @desc      Test route
// @access    Public
router.get("/", function (req, res) {
  res.send("Users route.");
});

// @route     POST /users/register
// @desc      Test route
// @access    Public
router.post(
  "/register",
  [
    check('name', 'Name is Required.').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
  ],
  function (req, res) {
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
      return res.status(400).json({errors: errors.array()});
    }
    res.send("Users route.");
  }
);

module.exports = router;
