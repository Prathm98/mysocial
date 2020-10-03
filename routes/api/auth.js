const express = require('express');
const router = express.Router();

// @route     GET api/auth
// @desc      Get Auth
// @access    Public
router.get('/', (req, res) => res.send('Auth Get works!!!'));

module.exports = router;
