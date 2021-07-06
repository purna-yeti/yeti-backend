const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

let ENV = 'dev';
switch(process.env.NODE_ENV) {
	case 'test':
	  	require('dotenv').config({ path: './.env_test'})
	  	break;
	case 'dev':
		require('dotenv').config({ path: './.env'})
		break;
	default:
		console.log(`ENV ${process.env.NODE_ENV} is not recognized, running dev instead`);
		require('dotenv').config({ path: './.env'})
}

// const user = require("./routes/user");
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

const port = process.env.PORT || 8000;
sequelize.sync().then(async () => {
	console.log("sequelize synced");
	app.listen(port, () => {
		console.log(`Console is running on port ${port} on env ${process.env.NODE_ENV}`);
	});
});


// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
