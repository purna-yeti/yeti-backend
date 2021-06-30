const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const sample = require("../middleware/sample");

router.post('/', auth, sample);
router.put('/content_id/:content_id', auth, sample);
router.delete('/content_id/:content_id', auth, sample);
router.get('/content_id/:content_id', auth, sample);
router.get('/project_id/:project_id', auth, sample);
router.get('/trail', auth, sample);

module.exports = router; 
