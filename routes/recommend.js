const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const sample = require("../middleware/sample");

router.get('/feed/:user_id', auth, sample);
router.get('/people/:user_id', auth, sample);
router.get('/similar/content_id/:content_id', auth, sample);
router.get('/paid', auth, sample);

module.exports = router; 
