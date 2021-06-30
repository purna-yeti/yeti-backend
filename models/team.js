const team = (sequelize, DataTypes) => {
    const Team = sequelize.define('team', {
      uuid: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
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
  
    Team.associate = (models) => {
      Team.belongsToMany(models.User, {through: models.TeamUser});
      Team.hasMany(models.Project);
    };
  
    return Team;
  };
  
module.exports = team;
  