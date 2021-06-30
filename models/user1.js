const user = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
      uuid: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      firstname: {
        type: DataTypes.STRING
      },
      lastname: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        validate: {
          notEmpty: true,
        },
      }
    });
  
    User.associate = (models) => {
      User.hasMany(models.Message, { onDelete: 'CASCADE' });
      User.belongsToMany(models.Team, { through: models.TeamUser});
      User.belongsToMany(models.Project, { through: models.UserProject });
      User.belongsToMany(models.Content, { through: models.UserContent });
      User.belongsToMany(models.User, { through: models.Friendship, as: 'followed'});
    };
  
    User.findByLogin = async (login) => {
      let user = await User.findOne({
        where: { username: login },
      });
  
      if (!user) {
        user = await User.findOne({
          where: { email: login },
        });
      }
  
      return user;
    };
  
    return User;
  };
  
module.exports = user;
  