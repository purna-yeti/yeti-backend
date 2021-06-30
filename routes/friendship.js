const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const sample = require("../middleware/sample");

router.put('/follow', auth, sample);
router.put('/unfollow', auth, sample);

module.exports = router; 
