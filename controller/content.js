const { models, sequelize } = require('../models');
const Team = models.Team;
const TeamUser = models.TeamUser;
const Project = models.Project;
const User = models.User;
const Content = models.Content;
const ContentVisit = models.ContentVisit;
const ContentStatus = models.ContentStatus;
const { check } = require("express-validator");
const { assert } = require('chai');
const { QueryTypes } = require('sequelize');

exports.checkCreateContent = [
    check("uri", "Please input correct uri")
        .not()
        .isEmpty(),
    check("doc", "Please input correct doc")
        .not()
        .isEmpty(),
    check("projectId", "Please input correct doc")
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
            const { uri, doc, projectId } = req.body;
            const userId = req.user.id;
            if (!await authToCreateContent(req.user.id, projectId)) {
                res.status(401).json(
                    { msg: "user is not authorized to create content" }
                );
            }

            let content = await Content.findOne(
                {
                    where: {uri} 
                }
            );
            if (!content) {
                content = await Content.create(
                    {
                        uri,
                        doc,
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
            const { uri, doc, projectId } = req.body;
            const userId = req.user.id;
            if (!await authToCreateContent(req.user.id, projectId)) {
                res.status(401).json(
                    { msg: "user is not authorized to create content" }
                );
            }

            let content = await Content.findOne(
                {
                    where: {uri} 
                }
            );
            if (!content) {
                content = await Content.create(
                    {
                        uri,
                        doc,
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
            else assert(false, `&{PREFIX}: content does not have status update`);
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
        SELECT projectId, 
            sum(isLike) as isLike,
            sum(isDislike) as isDislike,
            sum(isFavourite) as isFavourite
        FROM contentStatuses
        WHERE projectId=${projectId}
        `, 
        { type: QueryTypes.SELECT });
    const visit = await sequelize.query(`
        SELECT count(*) as visit
        FROM contentVisits
        WHERE projectId=${projectId} AND contentId=${contentId}
        `, 
        { type: QueryTypes.SELECT });
    return {status, visit};
}


