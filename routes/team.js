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
router.delete('/request', auth, controller.deleteTeamRequest);
router.get('/request/:id', auth, controller.getTeamRequests);

router.put('/request/approve', auth, controller.approveTeamRequest);
router.put('/request/disprove', auth, controller.disproveTeamRequest);


router.put('/', auth, sample);
router.delete('/', auth, sample);



module.exports = router; 
