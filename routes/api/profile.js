const express = require('express');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route     GET api/profile/me
// @desc      Get current user profile
// @access    Private
router.get("/me", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if(!profile){
      return res.status(400).json({msg: 'No profile found for this user.'});
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/profile
// @desc      Create or update user profile
// @access    Private
router.post("/", [auth, [
  check('status', "Status is required").not().isEmpty(),
  check('skills', "Skills are required").not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
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
    let profile = await Profile.findOne({user: req.user.id});

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
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// @route     GET api/profile
// @desc      Get all profiles
// @access    Public
router.get("/", async (req, res) => {
  try {
    let profile = await Profile.find().populate('user', ['name', 'avatar']);

    if(!profile){
      return res.status(400).json({msg: 'No profiles found'});
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route     GET api/profile/user/:user_id
// @desc      Get user profile by id
// @access    Public
router.get("/user/:user_id", async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

    if(!profile){
      return res.status(400).json({msg: 'Profile not found'});
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    if(err.kind == 'ObjectId'){
      return res.status(400).json({msg: 'Profile not found'});
    }
    return res.status(500).send('Server Error');
  }
});

// @route     DELETE api/profile
// @desc      Get user profile, posts & user
// @access    Private
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // create experience object
    const {
      title,
      location,
      company,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      location,
      company,
      from,
      to,
      current,
      description
    };

    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(newExp);
    await profile.save();

    res.json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience with given id
// @access   Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
    if(removeIndex < 0){
      return res.status(400).json({msg: "Experience not found"});
    }
    profile.experience.splice(removeIndex, 1);
    await profile.save();

    res.json({ msg: 'Experience Removed' });
  } catch (e) {
    console.error(e);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put('/education', [auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // create education object
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    const profile = await Profile.findOne({ user: req.user.id });
    profile.education.unshift(newEdu);
    await profile.save();

    res.json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education with given id
// @access   Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    
    if(removeIndex < 0){
      return res.status(400).json({msg: "Education not found"});
    }
    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json({ msg: 'Education Removed' });
  } catch (e) {
    console.error(e);
    res.status(500).send('Server Error');
  }
});

module.exports = router;