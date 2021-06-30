const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const sample = require("../middleware/sample");

router.post('/', auth, sample);
router.put('/', auth, sample);
router.delete('/', auth, sample);
router.post('/request', auth, sample);
router.delete('/request', auth, sample);
router.get('/request', auth, sample);
router.post('/approve', auth, sample);
router.post('/disprove', auth, sample)

module.exports = router; 
