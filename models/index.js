const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    // dialect: 'postgres',

    // sqlite! now!
    dialect: 'sqlite',
    storage: './testdb.sqlite3'
  },
);

const models = {
  User: require('./user1')(sequelize, Sequelize.DataTypes),
  Team: require('./team')(sequelize, Sequelize.DataTypes),
  Message: require('./message')(sequelize, Sequelize.DataTypes),
  Project: require('./project')(sequelize, Sequelize.DataTypes),
  Content: require('./content')(sequelize, Sequelize.DataTypes),
  TeamUser: require('./teamUser')(sequelize, Sequelize.DataTypes),
  UserProject: require('./userProject')(sequelize, Sequelize.DataTypes),
  UserContent: require('./userContent')(sequelize, Sequelize.DataTypes),
  Friendship: require('./friendship')(sequelize, Sequelize.DataTypes),
  ProjectContent: require('./projectContent')(sequelize, Sequelize.DataTypes),

};


Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

exports.sequelize = sequelize;
exports.models = models;
