const projectContent = (sequelize, DataTypes) => {
    const projectContent = sequelize.define('projectContent', {
      uuid: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      contentId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'content',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
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
    });
  
    projectContent.associate = (models) => {
      projectContent.belongsTo(models.Content, { foreignKey: 'contentId'});
      projectContent.belongsTo(models.Project, { foreignKey: 'projectId'});
    };
  
    return projectContent;
  };
  
module.exports = projectContent;
  