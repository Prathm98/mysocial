const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @route     GET /profile/me
// @desc      Get current user profile
// @access    Private
router.get("/me", auth, async function (req, res) {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if(!profile){
      return res.status(400).json({msg: 'There is no profile for this user'});
    }

    res.json(profile);
  } catch (e) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route     POST /profile/
// @desc      Update user profile
// @access    Private
router.post(
  "/",
  [
    auth, [
      check('status', 'Status is Required').not().isEmpty(),
      check('skills', 'Skills is Required').not().isEmpty()
    ]
  ],
  async function(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(bio) profileFields.bio = bio;
    if(location) profileFields.location = location;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills){
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(facebook) profileFields.social.facebook = facebook;

    try {
      let profile = Profile.findOne({user: req.user.id});

      // update profile
      if(profile){
        profile = await Profile.findOneAndUpdate(
          {user: req.user.id},
          {$set: profileFields},
          {new: true}
        );

        return res.json(profile);
      }

      // Create new profile
      profile = new Profile(profileFields);

      await profile.save();
      return res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server Error');
    }
});

module.exports = router;
