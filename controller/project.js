const { models, sequelize } = require('../models');
const Project = models.Project;
const TeamUser = models.TeamUser;
const Team = models.Team;
const { check } = require("express-validator");
const Sequelize = require("sequelize");

exports.checkCreateProject = [
  check("name", "Please input correct project name")
    .not()
    .isEmpty(),
  check("teamId", "Please input correct teamId")
    .isInt(),
]

async function authToCreateProject(adminId, teamId) {
  let admin = await TeamUser.findOne({
    where: {
      userId: adminId,
      teamId: teamId,
      requestStatus: 'APPROVED',
      userRole: 'OWNER'
    }
  });
  return admin !== undefined;
}

exports.createProject = async(req, res) => {
  const prefix = "POST /project";
  try {
    await sequelize.transaction(async (t) => {
      console.log(`${prefix}: create new project`);
      const {name, teamId} = req.body;
      if (!await authToCreateProject(req.user.id, teamId)) {
        res.status(401).json(
          {msg: "user is not authorized to create project"}
        );
      }
      let project = await Project.create(
        {
          name,
          teamId
        }
      );
      res.status(201).json(project);
    })
  } catch (error) {
    console.log(`${prefix}: ${error}`);
    res.status(500).json(error);
  }
};

exports.getProjects = async(req, res) => {
  const prefix = "GET /project";
  try {
    await sequelize.transaction(async (t) => {
      console.log(`${prefix}: get projects by user`);
      let teamUsers = await TeamUser.findAll({
        where: {
          userId: req.user.id,
          requestStatus: 'APPROVED',
        },
        include: [
          {
            model: Team,
            include: [{
              model: Project
            }]
          }
        ]
      });
      let projects = [];
      for (let tu of teamUsers) {
        for (let project of tu.team.projects) {
          projects.push(project);
        }
      }
      res.status(200).json(projects);
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