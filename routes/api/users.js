const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// @route     POST api/users
// @desc      Register a user
// @access    Public
router.post("/", [
   check('name', 'Name is required!!!').not().isEmpty(),
   check('email', 'Please enter valid Email!!!').isEmail(),
   check('password', 'Please enter a password of atleast 6 characters').isLength({ min: 6 })
 ], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if(user){
      return res.json({ errors: [{ msg: "User already exist"}] });
    }

    const avatar = gravatar.url(email, {
      s: '200', r: 'pg', d:'mm' 
    });

    user = new User({
      name, email, password, avatar
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    
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