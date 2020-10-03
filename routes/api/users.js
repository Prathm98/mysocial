const express = require('express');
const router = express.Router();

// @route     GET api/users
// @desc      Get Users
// @access    Public
router.get('/', (req, res) => res.send('User Get works!!!'));

module.exports = router;
