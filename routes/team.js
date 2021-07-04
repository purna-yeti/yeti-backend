const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const sample = require("../middleware/sample");
const controller = require('../controller/team');

router.post('/', auth, controller.createTeam);
router.get('/:id', auth, controller.getTeam);

router.put('/request', auth, 
    controller.checkSubmitTeamRequest, 
    controller.submitTeamRequest);
router.get('/users/:id', auth, controller.getTeamUsers);
router.put('/request/approve', auth, controller.approveTeamRequest);


router.put('/request/disprove', auth, controller.disproveTeamRequest);
router.put('/', auth, sample);
router.delete('/', auth, sample);
router.delete('/request', auth, controller.deleteTeamRequest);




module.exports = router; 
