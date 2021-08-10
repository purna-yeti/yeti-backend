const { sequelize, models } = require('../models');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
const { assert } = require('chai');
chai.use(chaiHttp);
const { getAnalyzedContent } = require("../controller/analyzedContent")

process.env.NODE_ENV = "local";

async function getProjectContents(projectId, token) {
    let res = await chai.request(server)
        .get(`/content/project_id/${projectId}`)
        .set('token', token)
    return res;
}

describe('test current', () => {
    before('clean up ', async function () {
        console.log('before');
        // await sequelize.sync({force: true})
        // console.log("sequelize force as true");
    });
    it('', async () => {
        var uri1 = getAnalyzedContent("https://www.google.com/search?q=dthh&source=hp&ei=HpcSYfuvEf2d0PEP0P-suAg&iflsig=AINFCbYAAAAAYRKlLrltt3dK2GxE8pyBz-uh62ln3EWN&oq=dthh&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEIAEMgUILhCABDIKCAAQsQMQgwEQCjIQCC4QsQMQgwEQxwEQowIQCjIHCC4QsQMQCjIHCAAQsQMQCjINCAAQsQMQgwEQyQMQCjIFCAAQkgMyBQgAEJIDMgcIABCxAxAKOhEILhCABBCxAxDHARCjAhCTAjoICAAQgAQQsQM6CAgAELEDEIMBOgsIABCABBCxAxCDAToRCC4QgAQQsQMQgwEQxwEQowI6DgguEIAEELEDEMcBEKMCOgUIABCxAzoLCC4QgAQQsQMQkwJQzAZYhQ9gwRFoAHAAeACAAasCiAHNCJIBAzItNJgBAKABAQ&sclient=gws-wiz&ved=0ahUKEwj7tofT3qbyAhX9DjQIHdA_C4cQ4dUDCAk&uact=5");
        var uri2 = getAnalyzedContent("https://yifymovies.pro/movie/episode/rick-and-morty-season-5-episode-8/")
        console.log(uri1.href);
        console.log(uri2.href);
    });

})

