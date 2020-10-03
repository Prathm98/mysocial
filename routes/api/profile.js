const express = require('express');
const router = express.Router();

// @route     GET api/profile
// @desc      Get Profile
// @access    Public
router.get('/', (req, res) => res.send('Profile Get works!!!'));

module.exports = router;
