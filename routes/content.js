const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const sample = require("../middleware/sample");
const controller = require ("../controller/content");


router.post('/visit', auth, 
  controller.checkCreateContent, 
  controller.visitContent);
router.put('/status', auth, 
  controller.checkCreateContent, 
  controller.statusContent);
router.post('/comment', auth, 
  controller.visitContent);
router.post('/reply', auth, 
  controller.visitContent);


router.put('/content_id/:content_id', auth, sample);
router.delete('/content_id/:content_id', auth, sample);
router.get('/content_id/:content_id', auth, sample);
router.get('/project_id/:project_id', auth, sample);
router.get('/trail', auth, sample);

module.exports = router; 
