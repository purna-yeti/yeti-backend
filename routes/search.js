const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const sample = require("../middleware/sample");

router.get('/search', auth, sample);

module.exports = router; 
