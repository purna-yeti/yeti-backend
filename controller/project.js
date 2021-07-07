const { models, sequelize } = require('../models');
const Project = models.Project;
const TeamUser = models.TeamUser;
const Team = models.Team;
const { check } = require("express-validator");
const Sequelize = require("sequelize");
const { QueryTypes } = require('sequelize');
const helper = require('./helper');

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


exports.getRecentProjects = async(req, res) => {
  const prefix = "GET /project/recent";
  try {
    await sequelize.transaction(async (t) => {
      console.log(`${prefix}: get recent projects by user ${req.user.id}`);
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
      let recent = await getRecentProjectsHelper(req.user.id);
      const now = new Date();
      let projects = [];
      for (let tu of teamUsers) {
        const teamName = tu.team.name;
        for (let project of tu.team.projects) {
          projects.push({
            projectId: project.id,
            projectName: project.name,
            teamId: project.teamId,
            teamName: teamName,
            checked: false,
            lastVisitAt: recent[project.id] !== undefined? new Date(recent[project.id]): null,
            lastVisitAtText: recent[project.id] !== undefined? helper.getLastVisitText(now, new Date(recent[project.id])): 'never',
          });
        }
      }
      projects.sort((a,b) => {
        if (a.lastVisitAt === null) return 1;
        if (b.lastVisitAt === null) return -1;
        return b.lastVisitAt - a.lastVisitAt;
      });
      if (projects.length > 0) projects[0].checked = true;
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


async function getRecentProjectsHelper(userId) {
  const visit = await sequelize.query(`
      SELECT projectId, max(updatedAt) as lastVisitAt
      FROM contentVisits
      WHERE userId=${userId}
      GROUP BY projectId
      `, 
      { type: QueryTypes.SELECT });
  
  return Object.assign({}, ...visit.map((x) => ({[x.projectId]: x.lastVisitAt})));
}
