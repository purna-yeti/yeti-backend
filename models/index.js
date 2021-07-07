const Sequelize = require('sequelize');
const { validationResult } = require("express-validator");

let params = {};
let ENV = 'dev';
switch(process.env.NODE_ENV) {
	case 'test':
    require('dotenv').config({ path: './.env_test'})
    params.storage = process.env.DATABASE;
    params.logging = false;
    params.dialect = process.env.DIALECT;
    break;
	case 'dev':
		require('dotenv').config({ path: './.env'})
    params.host = `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
    params.dialect = process.env.DIALECT;
    params.dialectOptions = {
      socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
    }
		break;
	default:
		console.log(`models: ENV ${process.env.NODE_ENV} is not recognized, running dev instead`);
		require('dotenv').config({ path: './.env'})
    params.host = `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
    params.dialect = process.env.DIALECT;
    params.dialectOptions = {
      socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
    }
}

console.log(process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  params)
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  params,
);

const models = {
  User: require('./user1')(sequelize, Sequelize.DataTypes),
  Team: require('./team')(sequelize, Sequelize.DataTypes),
  Message: require('./message')(sequelize, Sequelize.DataTypes),
  Project: require('./project')(sequelize, Sequelize.DataTypes),
  Content: require('./content')(sequelize, Sequelize.DataTypes),
  TeamUser: require('./teamUser')(sequelize, Sequelize.DataTypes),
  UserProject: require('./userProject')(sequelize, Sequelize.DataTypes),
  ContentVisit: require('./contentVisit')(sequelize, Sequelize.DataTypes),
  ContentStatus: require('./contentStatus')(sequelize, Sequelize.DataTypes),
  Friendship: require('./friendship')(sequelize, Sequelize.DataTypes),
  ContentComment: require('./contentComment')(sequelize, Sequelize.DataTypes),
  ContentReply: require('./contentReply')(sequelize, Sequelize.DataTypes),
};

models.validate = function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
}


Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

exports.sequelize = sequelize;
exports.models = models;
