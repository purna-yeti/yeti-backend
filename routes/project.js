const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const sample = require("../middleware/sample");

router.post('/', auth, sample);
router.put('/', auth, sample);
router.delete('/', auth, sample);
router.get('/project_id/:project_id', auth, sample);
router.get('/user_id/:user_id', auth, sample);

module.exports = router; 
