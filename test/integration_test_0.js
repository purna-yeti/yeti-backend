const { sequelize, models } = require('../models');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
const { assert } = require('chai');
chai.use(chaiHttp);
process.env.NODE_ENV = "test";


async function signup(username, email, password="password") {
    let res = await chai.request(server)
        .post('/user/signup')
        .set('content-type', 'application/json')
        .send({email, username, password});
    return res;
}
async function createTeam(name, token) {
    let res = await chai.request(server)
        .post('/team')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({name});
    return res;
}
async function getTeam(teamId, token) {
    let res = await chai.request(server)
        .get(`/team/${ teamId }`)
        .set('token', token)
    return res;
}
async function submitTeamRequest(teamId, token, userRole) {
    let res = await chai.request(server)
        .put('/team/request')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({userRole, teamId});
    return res;
}
async function getTeamUsers(teamId, token) {
    let res = await chai.request(server)
        .get(`/team/users/${ teamId }`)
        .set('token', token)
    return res;
}
async function approveTeamRequest(id, token) {
    let res = await chai.request(server)
        .put('/team/request/approve')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({ id })
    return res;
}
async function createProject(teamId, name, token) {
    let res = await chai.request(server)
        .post('/project')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({ name, teamId });
    return res;
}
async function getProjects(token) {
    let res = await chai.request(server)
        .get(`/project`)
        .set('token', token)
    return res;
}

async function visitContent(projectId, uri, doc, token) {
    let res = await chai.request(server)
        .post('/content/visit')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({ uri, doc, projectId });
    return res;
}

async function statusContent(projectId, uri, doc, statusKey, statusValue, token) {
    let body = {
        projectId, uri, doc
    };
    body[statusKey] = statusValue;
    let res = await chai.request(server)
        .put('/content/status')
        .set('content-type', 'application/json')
        .set('token', token)
        .send(body);
    return res;
}

async function getContentsByProject(projectId, token) {
    let res = await chai.request(server)
        .get(`/content/project/${projectId}`)
        .set('token', token)
    return res;
}

describe('Integration test 0', () => {
    before('clean up ', async function() {
        console.log('before');
        await sequelize.sync({force: true})
        console.log("sequelize force as true");
    });

    let users = [];
    it('sign up members', async () => {
        users.push(await signup("abel_the_first", "abel@gmail.com"), 
            await signup("bella_the_second", "bella@gmail.com"),
            await signup("charlie_the_third", "charlie@gmail.com"));
        users.forEach((user) => {assert(user.status === 201)});
        users.forEach((user) => {assert(user.body.token !== undefined)});
    });

    let team;
    it('abel create team as owner', async () => {
        const teamname = 'ABC Team';
        team = await createTeam(teamname, users[0].body.token);
        assert(team.status === 201);
        assert(team.body.id !== undefined);
        assert(team.body.name === teamname);
        let _ = await getTeam(team.body.id, users[0].body.token);
        assert(_.body.id === team.body.id);
    });

    let teamUsers;
    it('bella as editor, charlie as member', async () => {
        let x = await submitTeamRequest(team.body.id, users[1].body.token, 'EDITOR');
        assert(x.status === 201);
        let y = await submitTeamRequest(team.body.id, users[2].body.token, 'MEMBER');
        assert(y.status === 201);
        
        teamUsers = await getTeamUsers(team.body.id, users[0].body.token);
        await teamUsers.body.filter(tu => tu.requestStatus === 'PENDING' && tu.userRole === 'EDITOR')
        .forEach(async (tu) => {
            let res = await approveTeamRequest(tu.id, users[0].body.token);
            assert(res.status === 201);
        });
        teamUsers = await getTeamUsers(team.body.id, users[0].body.token);
        teamUsers.body.filter(tu => tu.requestStatus === 'PENDING' && tu.userRole === 'MEMBER')
        .forEach(async (tu) => {
            let res = await approveTeamRequest(tu.id, users[1].body.token);
            assert(res.status === 201);
        });
    });

    let projects;
    it('abel create a team project', async () => {
        let project = await createProject(team.body.id, "project korea first", users[0].body.token);
        assert(project.status === 201);
        project = await createProject(team.body.id, "project japan second", users[0].body.token);
        assert(project.status === 201);
        projects = await getProjects(users[1].body.token);
        assert(projects.body.length == 2);
    });

    it('abel submit content to the project, bella views', async () => {
        const uri = "https://www.youtube.com/results?search_query=lana+del+rey+radio";
        const doc = "<html> </html>";
        await visitContent(projects.body[0].id, 
            uri, doc, 
            users[0].body.token);
        await visitContent(projects.body[0].id, 
            uri, doc, 
            users[1].body.token);
        await visitContent(projects.body[0].id, 
            uri, doc, 
            users[0].body.token);
        await visitContent(projects.body[1].id, 
            uri, doc, 
            users[0].body.token);
        await statusContent(projects.body[0].id, uri, doc, 'isLike', true, users[0].body.token);
        await statusContent(projects.body[0].id, uri, doc, 'isFavourite', true, users[0].body.token);
        await statusContent(projects.body[0].id, uri, doc, 'isLike', false, users[0].body.token);
        await statusContent(projects.body[0].id, uri, doc, 'isLike', true, users[1].body.token);
        await statusContent(projects.body[0].id, uri, doc, 'isLike', true, users[1].body.token);
        await statusContent(projects.body[0].id, uri, doc, 'isLike', true, users[0].body.token);

        await statusContent(projects.body[1].id, uri, doc, 'isLike', true, users[1].body.token);

        await statusContent(projects.body[1].id, uri, doc, 'isFavourite', true, users[1].body.token);

        content = await visitContent(projects.body[0].id, 
            uri, doc, 
            users[2].body.token);

        console.log(content.body);

    });
    
    
    // });
    
    // it('it should GET project after login', (done) => {
    //     chai.request(server)
    //     .post('/user/login')
    //     .set('content-type', 'application/json')
    //     .send({email: "purna1@purna1w.com", password: 'password'})
    //     .end((err,res) => {
    //         console.log(res.body.token);
    //         chai.request(server)
    //         .get('/project')
    //         .set('token', res.body.token)
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             done();
    //         });;
    //     });
    // })
})

