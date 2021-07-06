const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const sample = require("../middleware/sample");
const controller = require("../controller/project");

router.post('/', auth, 
    controller.checkCreateProject, 
    controller.createProject);
router.get('/', auth, controller.getProjects);

router.get('/recent', auth, controller.getRecentProjects);

router.put('/', auth, sample);
router.delete('/', auth, sample);
router.get('/project_id/:project_id', auth, sample);
router.get('/user_id/:user_id', auth, sample);

module.exports = router; 
