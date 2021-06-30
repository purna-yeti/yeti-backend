const project = (sequelize, DataTypes) => {
    const Project = sequelize.define('project', {
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
  
    Project.associate = (models) => {
      Project.belongsToMany(models.User, { through: models.UserProject });
      Project.belongsTo(models.Team);
      Project.belongsToMany(models.Content, { through: models.ProjectContent });

    };
  
    return Project;
  };
  
module.exports = project;
  