const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
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
  async function (req, res) {
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
      return res.status(400).json({errors: errors.array()});
    }

    const {name, email, password} = req.body;
    try {
      // See if user exist
      let user = await User.findOne({email});
      if(user){
        return res.status(400).json({errors: ["User already exists."] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      // Encrypt password
      user = new User({
        name,
        email,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get('jwtSecrete'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (e) {
      console.log(e);
      res.status(500).send("Server Gone");
    }
  }
);

module.exports = router;
