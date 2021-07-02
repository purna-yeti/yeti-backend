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
async function getTeamRequests(teamId, token) {
    let res = await chai.request(server)
        .get(`/team/request/${ teamId }`)
        .set('token', token)
    return res;
}
async function approveTeamRequest(id, token) {
    let res = await chai.request(server)
        .put('/team/request/approve')
        .set('content-type', 'application/json')
        .set('token', token)
        .send({ id })
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

    it('bella as editor, charlie as member', async () => {
        let x = await submitTeamRequest(team.body.id, users[1].body.token, 'EDITOR');
        assert(x.status === 201);
        let y = await submitTeamRequest(team.body.id, users[2].body.token, 'MEMBER');
        assert(y.status === 201);
        let teamRequests = await getTeamRequests(team.body.id, users[0].body.token);
        console.log(teamRequests.body);
    });

    it('charlie request as member', async () => {
        // const teamname = 'ABC Team';
        // team = await createTeam(teamname, users[0].body.token);
        // assert(team.status === 201);
        // assert(team.body.id !== undefined);
        // assert(team.body.name === teamname);
        // let _ = await getTeam(team.body.id, users[0].body.token);
        // assert(_.body.id === team.body.id);
    });

    it('get all team users', async () => {
        // const teamname = 'ABC Team';
        // team = await createTeam(teamname, users[0].body.token);
        // assert(team.status === 201);
        // assert(team.body.id !== undefined);
        // assert(team.body.name === teamname);
        // let _ = await getTeam(team.body.id, users[0].body.token);
        // assert(_.body.id === team.body.id);
    });
    
    it('abel create a team project', async () => {
        // const teamname = 'ABC Team';
        // team = await createTeam(teamname, users[0].body.token);
        // assert(team.status === 201);
        // assert(team.body.id !== undefined);
        // assert(team.body.name === teamname);
        // let _ = await getTeam(team.body.id, users[0].body.token);
        // assert(_.body.id === team.body.id);
    });

    it('abel submit content to the project, bella views', async () => {
        // const teamname = 'ABC Team';
        // team = await createTeam(teamname, users[0].body.token);
        // assert(team.status === 201);
        // assert(team.body.id !== undefined);
        // assert(team.body.name === teamname);
        // let _ = await getTeam(team.body.id, users[0].body.token);
        // assert(_.body.id === team.body.id);
    });

    it('charlie submit content', async () => {
        // const teamname = 'ABC Team';
        // team = await createTeam(teamname, users[0].body.token);
        // assert(team.status === 201);
        // assert(team.body.id !== undefined);
        // assert(team.body.name === teamname);
        // let _ = await getTeam(team.body.id, users[0].body.token);
        // assert(_.body.id === team.body.id);
    });

    it('charlie view content statistics', async () => {
        // const teamname = 'ABC Team';
        // team = await createTeam(teamname, users[0].body.token);
        // assert(team.status === 201);
        // assert(team.body.id !== undefined);
        // assert(team.body.name === teamname);
        // let _ = await getTeam(team.body.id, users[0].body.token);
        // assert(_.body.id === team.body.id);
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


// describe('Books', () => {
//     beforeEach((done) => {
//         Book.remove({}, (err) => {
//            done();
//         });
//     });
//   describe('/GET book', () => {
//       it('it should GET all the books', (done) => {
//             chai.request(server)
//             .get('/book')
//             .end((err, res) => {
//                   res.should.have.status(200);
//                   res.body.should.be.a('array');
//                   res.body.length.should.be.eql(0);
//               done();
//             });
//       });
//   });
//   describe('/POST book', () => {
//       it('it should not POST a book without pages field', (done) => {
//           let book = {
//               title: "The Lord of the Rings",
//               author: "J.R.R. Tolkien",
//               year: 1954
//           }
//             chai.request(server)
//             .post('/book')
//             .send(book)
//             .end((err, res) => {
//                   res.should.have.status(200);
//                   res.body.should.be.a('object');
//                   res.body.should.have.property('errors');
//                   res.body.errors.should.have.property('pages');
//                   res.body.errors.pages.should.have.property('kind').eql('required');
//               done();
//             });
//       });
//       it('it should POST a book ', (done) => {
//           let book = {
//               title: "The Lord of the Rings",
//               author: "J.R.R. Tolkien",
//               year: 1954,
//               pages: 1170
//           }
//             chai.request(server)
//             .post('/book')
//             .send(book)
//             .end((err, res) => {
//                   res.should.have.status(200);
//                   res.body.should.be.a('object');
//                   res.body.should.have.property('message').eql('Book successfully added!');
//                   res.body.book.should.have.property('title');
//                   res.body.book.should.have.property('author');
//                   res.body.book.should.have.property('pages');
//                   res.body.book.should.have.property('year');
//               done();
//             });
//       });
//   });
//   describe('/GET/:id book', () => {
//       it('it should GET a book by the given id', (done) => {
//           let book = new Book({ title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, pages: 1170 });
//           book.save((err, book) => {
//               chai.request(server)
//             .get('/book/' + book.id)
//             .send(book)
//             .end((err, res) => {
//                   res.should.have.status(200);
//                   res.body.should.be.a('object');
//                   res.body.should.have.property('title');
//                   res.body.should.have.property('author');
//                   res.body.should.have.property('pages');
//                   res.body.should.have.property('year');
//                   res.body.should.have.property('_id').eql(book.id);
//               done();
//             });
//           });

//       });
//   });
//   describe('/PUT/:id book', () => {
//       it('it should UPDATE a book given the id', (done) => {
//           let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
//           book.save((err, book) => {
//                 chai.request(server)
//                 .put('/book/' + book.id)
//                 .send({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1950, pages: 778})
//                 .end((err, res) => {
//                       res.should.have.status(200);
//                       res.body.should.be.a('object');
//                       res.body.should.have.property('message').eql('Book updated!');
//                       res.body.book.should.have.property('year').eql(1950);
//                   done();
//                 });
//           });
//       });
//   });
//  /*
//   * Test the /DELETE/:id route
//   */
//   describe('/DELETE/:id book', () => {
//       it('it should DELETE a book given the id', (done) => {
//           let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
//           book.save((err, book) => {
//                 chai.request(server)
//                 .delete('/book/' + book.id)
//                 .end((err, res) => {
//                       res.should.have.status(200);
//                       res.body.should.be.a('object');
//                       res.body.should.have.property('message').eql('Book successfully deleted!');
//                       res.body.result.should.have.property('ok').eql(1);
//                       res.body.result.should.have.property('n').eql(1);
//                   done();
//                 });
//           });
//       });
//   });
// });