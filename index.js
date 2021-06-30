const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const user = require("./routes/user");
const user1 = require("./routes/user1");
const project = require("./routes/project");
const content = require("./routes/content");
const team = require("./routes/team");
const search = require("./routes/search");
const friendship = require('./routes/friendship');
const recommend = require('./routes/recommend');
const pubsub = require('./routes/pubsub');
const app = express();

const { sequelize, models } = require('./models/index');


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const { create } = require('./models/User');


mongoose
	.connect(process.env.DEV_DB, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
	.then(()=> console.log('Mongo DB Connected'))
	.catch(err=>{
		console.log(err);
	})



app.use(morgan('dev'));
app.use(bodyParser.json({limit: '200mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(cors({ origin: "*"}));

// routers
app.use('/user', user1);
app.use('/project', project);
app.use('/content', content);
app.use('/team', team);
app.use('/search', search);
app.use('/friendship', friendship);
app.use('/recommend', recommend);
app.use('/', pubsub);


const loadData = async () => {
	const abel = await models.User.create(
	  {
		username: 'abel',
		firstname: 'abel',
		lastname: 'bernakel',
		email: 'abel@gmail.com',
		password: 'abel_password',
	  }
	);
	const bella = await models.User.create(
	  {
		username: 'bella',
		firstname: 'bella',
		lastname: 'sabilla',
		email: 'bella@gmail.com',
		password: 'bella_password',
	  }
	);
	const charlie = await models.User.create(
		{
		  username: 'charlie',
		  firstname: 'charlie',
		  lastname: 'edward',
		  email: 'charlie@gmail.com',
		  password: 'charlie_password',
		}
	);
	const team = await models.Team.create(
		{
			name: 'alpha team',
		}
	);

	await models.TeamUser.create(
		{
			teamId: team.id,
			userId: abel.id,
			userRole: 'OWNER',
			requestStatus: 'APPROVED',
		}
	)
	await models.TeamUser.create(
		{
			teamId: team.id,
			userId: bella.id,
			userRole: 'EDITOR',
			requestStatus: 'APPROVED',
		}
	)
	await models.TeamUser.create(
		{
			teamId: team.id,
			userId: charlie.id,
			userRole: 'MEMBER',
			requestStatus: 'PENDING',
		}
	)
	// await models.UserProject.create(
	// 	{
	// 		projectId: team.id,
	// 		userId: abel.id
	// 	}
	// )
	const abelProj = await models.Project.create(
		{
			name: 'abel personal project'
		}
	)
	await models.UserProject.create( {
		projectId: abelProj.id,
		userId: abel.id
	});

	const alphaProj = await models.Project.create(
		{
			name: 'alpha team project',
			teamId: team.id
		},
		{include: [models.Team]}
	)
	await models.Project.create(
		{
			name: 'second alpha team prooject',
			teamId: team.id,
			contents: [
				{
					url: "www.google.com",
					doc: "<http> </http>"
				},
				{
					url: "www.google.com/tag",
					doc: "<http> </http>"
				}
			]
		},
		{include: [models.Content]}
	)

	await models.Friendship.create(
		{
			userId: abel.id,
			followedId: bella.id,
		}
	)
  };

const port = process.env.PORT || 8000;
sequelize.sync({force: true}).then(async () => {
	console.log("sequelize synced");
	loadData();
	app.listen(port, () => {
		console.log(`Console is running on port ${port}`);
	});
});


// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
