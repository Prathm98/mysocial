const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// @route     GET api/auth
// @desc      Get auth user
// @access    Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/auth
// @desc      login user
// @access    Public
router.post("/", [  
  check('email', 'Please enter valid Email!!!').isEmail(),
  check('password', 'Password is Required!!!').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if(!user){
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials!!!"}] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials!!!"}] });
    }

    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(payload, config.get('jwtSecrete'), {expiresIn: 36000}, (err, token) => {
      if(err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: [{msg: "Server Error"}] });
  }  
});

module.exports = router;