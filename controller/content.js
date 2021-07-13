const { models, sequelize } = require('../models');
const Team = models.Team;
const TeamUser = models.TeamUser;
const Project = models.Project;
const User = models.User;
const Content = models.Content;
const ContentVisit = models.ContentVisit;
const ContentStatus = models.ContentStatus;
const { check } = require("express-validator");
const { QueryTypes } = require('sequelize');
const helper = require('./helper');


exports.checkCreateContent = [
    check("uri", "Please input correct uri")
        .not()
        .isEmpty(),
    check("title", "Please input correct title")
        .not()
        .isEmpty(),
    check("hostname", "Please input correct title")
        .not()
        .isEmpty(),
    check("pathname", "Please input correct title")
        .not()
        .isEmpty(),
    check("search", "Please input correct title")
        .not()
        .isEmpty(),
    check("projectId", "Please input correct projectId")
        .isInt(),
]


async function authToCreateContent(userId, projectId) {
    let project = await Project.findOne({
        where: { id: projectId }
    });
    let user = await TeamUser.findOne({
        where: {
            userId,
            teamId: project.teamId,
            requestStatus: 'APPROVED',
        }
    });
    return user !== undefined;
}

exports.visitContent = async (req, res) => {
    const prefix = "POST /content/visit";
    try {
        await sequelize.transaction(async (t) => {
            console.log(`${prefix}: create new visit content`);
            const { uri, title, hostname, pathname, search, projectId } = req.body;
            const userId = req.user.id;
            if (!await authToCreateContent(req.user.id, projectId)) {
                res.status(401).json(
                    { msg: "user is not authorized to create content" }
                );
            }

            let content = await Content.findOne(
                {
                    where: { uri }
                }
            );
            if (!content) {
                content = await Content.create(
                    {
                        uri, title, hostname, pathname, search, 
                    }
                )
            }
            let visit = await ContentVisit.create({
                projectId,
                userId,
                contentId: content.id
            });
            let status = await ContentStatus.findOne({
                where: {
                    projectId,
                    userId,
                    contentId: content.id
                }
            });

            if (!status) {
                await ContentStatus.create({
                    projectId,
                    userId,
                    contentId: content.id
                });
            }
            let contentStat = await getContentStats(userId, content.id, projectId);
            res.status(201).json(contentStat);
        })
    } catch (error) {
        console.log(`${prefix}: ${error}`);
        res.status(500).json(error);
    }
};

exports.statusContent = async (req, res) => {
    const prefix = "PUT /content/status";
    try {
        await sequelize.transaction(async (t) => {
            console.log(`${prefix}: update content status`);
            const { uri, title, hostname, pathname, search, projectId } = req.body;
            const userId = req.user.id;
            if (!await authToCreateContent(req.user.id, projectId)) {
                res.status(401).json(
                    { msg: "user is not authorized to create content" }
                );
            }

            let content = await Content.findOne(
                {
                    where: { uri }
                }
            );
            if (!content) {
                content = await Content.create(
                    {
                        uri, title, hostname, pathname, search, 
                    }
                );
            }

            let status = await ContentStatus.findOne({
                where: {
                    projectId,
                    userId,
                    contentId: content.id
                }
            });
            if (!status) {
                status = await ContentStatus.create({
                    projectId,
                    userId,
                    contentId: content.id
                });
            }
            if (req.body.isLike !== undefined) status.isLike = req.body.isLike;
            else if (req.body.isDislike !== undefined) status.isDislike = req.body.isDislike;
            else if (req.body.isFavourite !== undefined) status.isFavourite = req.body.isFavourite;
            else res.status(500).json({
                msg: `${PREFIX}: content does not have status update`
            });
            await status.save();
            res.status(201).json(status);
        })
    } catch (error) {
        console.log(`${prefix}: ${error}`);
        res.status(500).json(error);
    }
};


async function getContentStats(userId, contentId, projectId) {
    const status = await sequelize.query(`
        SELECT
            COUNT(CASE WHEN "isLike" THEN 1 END)  as islike,
            COUNT(CASE WHEN "isDislike" THEN 1 END)  as isdislike,
            COUNT(CASE WHEN "isFavourite" THEN 1 END)  as isfavourite
        FROM public."contentStatuses"
        WHERE "projectId"=${projectId} AND "contentId"=${contentId}
        `,
        { type: QueryTypes.SELECT });
    const visit = await sequelize.query(`
        SELECT count(*) as visit
        FROM public."contentVisits"
        WHERE "projectId"=${projectId} AND "contentId"=${contentId}
        `,
        { type: QueryTypes.SELECT });
    const userStatus = await ContentStatus.findOne({
        where: {
            userId,
            contentId,
            projectId
        }
    });
    const resp = {
        team: {
            isLike: parseInt(status[0].islike || 0),
            isDislike: parseInt(status[0].isdislike || 0),
            isFavourite: parseInt(status[0].isfavourite || 0),
            visit: parseInt(visit[0].visit),
        },
        user: {
            isLike: userStatus.isLike? 1: 0,
            isDislike: userStatus.isDislike? 1: 0,
            isFavourite: userStatus.isFavourite? 1: 0,
        }
    }
    return resp;
}

exports.getProjectContent = async (req, res) => {
    const projectId = parseInt(req.params.project_id);
    const prefix = `GET content/project_id/${projectId}`;
    try {
        await sequelize.transaction(async (t) => {
            console.log(`${prefix}: get content project by projectId ${projectId}`);
            let status = await sequelize.query(`
                SELECT * 
                FROM (SELECT "contentId", 
                    COUNT(CASE WHEN "isLike" THEN 1 END)  as islike,
                    COUNT(CASE WHEN "isDislike" THEN 1 END)  as isdislike,
                    COUNT(CASE WHEN "isFavourite" THEN 1 END)  as isfavourite
                FROM public."contentStatuses" 
                WHERE "projectId"=${projectId}
                GROUP BY "contentId") a
                ORDER BY isfavourite DESC, islike DESC, isdislike ASC
                LIMIT 25
            `,
                { type: QueryTypes.SELECT });
        
            let visits = await sequelize.query(`
                SELECT cv."contentId", 
                    max(cv."updatedAt") as lastvisitat, 
                    count(cv."updatedAt") as visit, 
                    min(c."title") as title, 
                    min(c."uri") as uri, 
                    min(c."hostname") as hostname
                FROM public."contentVisits" cv join public."contents" c on cv."contentId"=c."id"
                WHERE cv."projectId"=${projectId}
                GROUP BY cv."contentId"
            `,
                { type: QueryTypes.SELECT });
            visits = Object.assign({}, ...visits.map((x) => ({
                    [x.contentId]: x
                    })));
            const now = new Date();
            let resp = [];
            for (let s of status) {
                if (s.islike || s.dislike || s.isfavourite) {
                    resp.push({
                        contentId: visits[s.contentId].contentId,
                        contentTitle: visits[s.contentId].title,
                        contentUri: visits[s.contentId].uri,
                        contentHostname: visits[s.contentId].hostname,
                        lastVisitAt: visits[s.contentId].lastvisitat,
                        lastVisitAtText: helper.getLastVisitText(now, new Date(visits[s.contentId].lastvisitat)),
                        isLike: parseInt(s.islike || 0),
                        isDislike: parseInt(s.isdislike || 0),
                        isFavourite: parseInt(s.isfavourite || 0),
                    });
                }
                
            }
            res.status(200).json(resp);
        })

        // , sum(cs.isLike), sum(cs.isDislike), sum(cs.isFavourite), count(cs.contentId) as visits
    } catch (error) {
        console.log(`${prefix}: ${error}`);
        res.status(500).json(error);
    }

}
