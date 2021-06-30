const userProject = (sequelize, DataTypes) => {
    const userProject = sequelize.define('userProject', {
      uuid: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      projectId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'project',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'user',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      isFavourite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,   
      },
      isHidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,   
      },
    });
  
    userProject.associate = (models) => {
      userProject.belongsTo(models.Project, { foreignKey: 'projectId'});
      userProject.belongsTo(models.User, { foreignKey: 'userId'});
    };
  
    return userProject;
  };
  
module.exports = userProject;
  