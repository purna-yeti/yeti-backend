const { sequelize, models } = require('../models');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
const { assert } = require('chai');
chai.use(chaiHttp);
process.env.NODE_ENV = "local";
const restart = true;

const owner = {
    email: "purnawirman@yeti-hunt.com",
    username: 'purnawirman',
    password: 'password'
}
let users = [
    {
        email: "tri.wira.efendi@gmail.com",
        username: 'tri.wira.efendi',
        password: 'password',
        teamId: 1
    },
    {
        email: "yasmineyapanala@gmail.com",
        username: 'yasminepanala',
        password: 'password',
        teamId: 1
    },
    {
        email: "edith.zhengwenyuan@gmail.com",
        username: 'edith.zhengwenyuan',
        password: 'password',
        teamId: 1
    },
    {
        email: "luthfir272@gmail.com",
        username: 'luthfir272',
        password: 'password',
        teamId: 1
    },
    {
        email: "purnama.indra00@gmail.com",
        username: 'purnama.indra00',
        password: 'password',
        teamId: 1
    },
    {
        email: "mkurniawan.mk@gmail.com",
        username: 'mkurniawan.mk',
        password: 'password',
        teamId: 1
    },
    {
        email: "andriyanto.halim@gmail.com",
        username: 'andriyanto.halim',
        password: 'password',
        teamId: 1
    },
    {
        email: "michael.adr@gmail.com",
        username: 'michael.adr',
        password: 'password',
        teamId: 1
    },
    {
        email: "elvina.guo@gmail.com",
        username: 'elvina.guo',
        password: 'password',
        teamId: 1
    },
    {
        email: "sugarpuff77@gmail.com",
        username: 'sugarpuff',
        password: 'password',
        teamId: 1
    },
    {
        email: "timtreasure4@gmail.com",
        username: 'timtreasure4',
        password: 'password',
        teamId: 1
    }
]
// users = [
    
// ];
if (restart) { users = [] };
let teams = [
    {
        name: 'pre-alpha 0'
    }
]
let projects = [
    {
        name: 'PROJECT PRE-ALPHA 0',
        teamId: 1
    }
]


async function signup(username, email, password = "password") {
    let res = await chai.request(server)
        .post('/user/signup')
        .set('content-type', 'application/json')
        .send({ email, username, password });
    return res;
}
async function login(username, email, password = "password") {
    let res = await chai.request(server)
        .post('/user/login')
        .set('content-type', 'application/json')
        .send({ email, username, password });
    return res;
}
async function createTeam(name, token) {
    let res = await chai.request(server)
        .post('/team')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({ name });
    return res;
}
async function getTeam(teamId, token) {
    let res = await chai.request(server)
        .get(`/team/${teamId}`)
        .set('token', token)
    return res;
}
async function submitTeamRequest(teamId, token, userRole) {
    let res = await chai.request(server)
        .put('/team/request')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({ userRole, teamId });
    return res;
}
async function getTeamUsers(teamId, token) {
    let res = await chai.request(server)
        .get(`/team/users/${teamId}`)
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

async function visitContent({ projectId, uri, title, hostname, pathname, search, token }) {
    let res = await chai.request(server)
        .post('/content/visit')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({ uri, title, hostname, pathname, search, projectId });
    return res;
}

async function statusContent({ projectId, uri, title, hostname, pathname, search, statusKey, statusValue, token }) {
    let body = {
        projectId, uri, title, hostname, pathname, search,
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

async function getRecentProjects(token) {
    let res = await chai.request(server)
        .get(`/project/recent`)
        .set('token', token)
    return res;
}

async function getProjectContents(projectId, token) {
    let res = await chai.request(server)
        .get(`/content/project_id/${projectId}`)
        .set('token', token)
    return res;
}

describe('Pre alpha test 0', () => {
    before('clean up ', async function () {
        console.log('before');
        if (restart) {
          await sequelize.sync({force: true})
          console.log("sequelize force as true");
        }
        
    });
    it('load all', async () => {
        let ownerResp;
        if (restart) {
          ownerResp = await signup(owner.username, owner.email, owner.password);
        } else {
          ownerResp = await login(owner.username, owner.email, owner.password);
        }
        const ownerToken = ownerResp.body.token;
        if (restart) {
          for (let t of teams) await createTeam(t.name, ownerToken);
          for (let p of projects) await createProject(p.teamId, p.name, ownerToken);
        }
        for (let u of users) {
            let userResp = await signup(u.username, u.email, u.password);
            userResp = await login(u.username, u.email, u.password);
            let teamReqResp = await submitTeamRequest(u.teamId, userResp.body.token, 'MEMBER');
            await approveTeamRequest(teamReqResp.body.id, ownerToken);
        }
    });

})

