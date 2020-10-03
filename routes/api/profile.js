const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route     GET api/profile/me
// @desc      Get Profile of current user
// @access    Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if(!profile){
      return res.status(400).json({ msg: 'There is no profile for this user.'});
    }
    console.log(profile);

    res.json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error!!!');
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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

    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(location) profileFields.location = location;
    if(website) profileFields.website = website;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills){
      profileFields.skills = skills.split(',').map((skill) => ' ' + skill.trim());
    }

    // Build social object and add to profileFields
    const socialfields = { youtube, twitter, instagram, linkedin, facebook };

    profileFields.social = socialfields;

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user id
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
    if(!profile){
      return res.status(400).json({ msg: "Profile not found!!!"});
    }

    res.json(profile);
  } catch (e) {
    console.error(e);
    if(e.kind){
      return res.status(400).json({ msg: "Profile not found!!!"});
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/profile
// @desc     Delete current user profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // todo - delete user posts

    // delete user profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // delete user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User Removed' });
  } catch (e) {
    console.error(e);
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
    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json({ msg: 'Education Removed' });
  } catch (e) {
    console.error(e);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
