// const Product = require('../model/product');
// const Page = require('../model/page');
const { models, sequelize } = require('../models');
const Team = models.Team;
const TeamUser = models.TeamUser;
const User = models.User;
const { check, validationResult } = require("express-validator");

exports.createTeam = async (req, res) => {
  const prefix = "POST /team";
  try {
    await sequelize.transaction(async (t) => {
      console.log(`${prefix}: create new team`);
      let team = await Team.create(
        {
          name: req.body.name,
        }
      );
      await TeamUser.create(
        {
          teamId: team.id,
          userId: req.user.id,
          userRole: 'OWNER',
          requestStatus: 'APPROVED'
        }
      );
      res.status(201).json(team);
    })
  } catch (error) {
    console.log(`${prefix}: ${error}`);
    res.status(500).json(error);
  }
};


exports.getTeam = async(req, res) => {
  const prefix = "GET /team/:id";
  try {
    await sequelize.transaction(async (t) => {
      console.log(`${prefix}: get team by id`);
      let team = await Team.findOne({where: {id: req.params.id}});
      res.status(200).json(team);
    })
  } catch (error) {
    console.log(`${prefix}: ${error}`);
    res.status(500).json(error);
  }
}

exports.checkSubmitTeamRequest = [
  check("userRole", "Please input correct userRole: OWNER, EDITOR, MEMBER")
    .isIn(TeamUser.USER_ROLE),
  check("teamId", "Please input correct teamId")
    .isInt(),
]

exports.submitTeamRequest = async(req, res) => {
  const prefix = "PUT /team/request";
  models.validate(req, res);

  try {
    await sequelize.transaction(async (t) => {
      console.log(`${prefix}: submit team request`);
      const { teamId, userRole } = req.body;
      let team = await Team.findOne({where: {id: teamId}});
      if (team) {
        let teamUser = await TeamUser.create({
          teamId,
          userId: req.user.id,
          userRole,
          requestStatus: 'PENDING'
        });
        res.status(201).json(teamUser);
      } else {
        res.status(404).json({
          msg: "Team does not exist",
        });
      }
    })
  } catch (error) {
    console.log(`${prefix}: ${error}`);
    res.status(500).json(error);
  }
}

exports.deleteTeamRequest = async(req, res) => {
  const prefix = "DELETE /team/request";
  try {
    
  } catch (error) {
    
  }
}

/**
 * only owner and editor of the team can view the team request
 * @param {*} req 
 * @param {*} res 
 */
exports.getTeamRequests = async(req, res) => {
  const prefix = "GET /team/request/:id";
  try {
    await sequelize.transaction(async (t) => {
      console.log(`${prefix}: get team requests`);
      let teamUsers = await TeamUser.findAll({
        where: {
          teamId: parseInt(req.params.id),
        }
      });
      let admin = teamUsers.filter((tu) => {
        return tu.userId === req.user.id 
          && (tu.userRole === 'OWNER' || tu.userRole === 'EDITOR')
          && tu.requestStatus === 'APPROVED'});
      if (admin.length === 0) {
        res.status(401).json({ message: "user is not authorized"});
      }
      res.status(200).json(teamUsers);
    })
  } catch (error) {
    console.log(`${prefix}: ${error}`);
    res.status(500).json(error);
  }
}

/**
 * owner can approve new owners and editors
 * editor can approve new members
 * @param {*} req 
 * @param {*} res 
 */
exports.approveTeamRequest = async(req, res) => {
  const prefix = "PUT /team/approve";
  try {
    await sequelize.transaction(async (t) => {
      console.log(`${prefix}: approve team request`);
      let team = await Team.findOne({where: {id: req.params.id}});
      res.status(200).json(team);
    })
  } catch (error) {
    console.log(`${prefix}: ${error}`);
    res.status(500).json(error);
  }
}

exports.disproveTeamRequest = async(req, res) => {
  const prefix = "PUT /team/disprove";
  try {
    await sequelize.transaction(async (t) => {
      console.log(`${prefix}: get team by id`);
      let team = await Team.findOne({where: {id: req.params.id}});
      res.status(200).json(team);
    })
  } catch (error) {
    console.log(`${prefix}: ${error}`);
    res.status(500).json(error);
  }
}

exports.updateProject = (req, res, next) => {
  //at end of for loop
  res.status(201).json({
    project_id: "project_id"
  });
};

exports.deleteProject = (req, res, next) => {
  //at end of for loop
  res.status(201).json({
    project_id: "project_id"
  });
};