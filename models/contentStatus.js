const contentStatus = (sequelize, DataTypes) => {
    const contentStatus = sequelize.define('contentStatus', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      contentId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'contents',
          key: 'id'
        },
        // onDelete: 'cascade',
        // onUpdate: 'cascade',
      },
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'users',
          key: 'id'
        },
        // onDelete: 'cascade',
        // onUpdate: 'cascade',
      },
      projectId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'projects',
          key: 'id'
        },
        // onDelete: 'cascade',
        // onUpdate: 'cascade',
      },
      isFavourite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,   
      },
      isLike: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,   
      },
      isDislike: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,   
      },
    },
    {
      uniqueKeys: {
        actions_unique: {
            fields: ['userId', 'projectId', 'contentId']
        }
    }
    });
  
    contentStatus.associate = (models) => {
      contentStatus.belongsTo(models.Content, { foreignKey: 'contentId'});
      contentStatus.belongsTo(models.User, { foreignKey: 'userId'});
      contentStatus.belongsTo(models.Project, { foreignKey: 'projectId'});

    };
  
    return contentStatus;
  };
  
module.exports = contentStatus;
  