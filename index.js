const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const user = require("./routes/user");
const project = require("./routes/project");
const content = require("./routes/content");
const search = require("./routes/search");
const friendship = require('./routes/friendship');
const recommend = require('./routes/recommend');
const pubsub = require('./routes/pubsub');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');


mongoose
	.connect(process.env.DEV_DB, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
	.then(()=> console.log('DB Connected'))
	.catch(err=>{
		console.log(err);
	})

app.use(morgan('dev'));
app.use(bodyParser.json({limit: '200mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(cors({ origin: "*"}));

// routers
app.use('/user', user);
app.use('/project', project);
app.use('/content', content);
app.use('/search', search);
app.use('/friendship', friendship);
app.use('/recommend', recommend);
app.use('/', pubsub);


// app.post('/', (req, res) => {
//     if (!req.body) {
//       const msg = 'no Pub/Sub message received';
//       console.error(`error: ${msg}`);
//       res.status(400).send(`Bad Request: ${msg}`);
//       return;
//     }
//     if (!req.body.message) {
//       const msg = 'invalid Pub/Sub message format';
//       console.error(`error: ${msg}`);
//       res.status(400).send(`Bad Request: ${msg}`);
//       return;
//     }
  
//     const pubSubMessage = req.body.message;
//     const name = pubSubMessage.data
//       ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
//       : 'World';
  
//     console.log(`Hello ${name}!`);
//     res.status(204).send();
//   });


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Console is running on port ${port}`);
});

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
