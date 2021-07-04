const contentComment = (sequelize, DataTypes) => {
    const contentComment = sequelize.define('contentComment', {
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
      comment: {
        type: DataTypes.TEXT,
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
        // constraints: false,
        // onDelete: 'cascade',
        // onUpdate: 'cascade',
      },
    });
  
    contentComment.associate = (models) => {
      contentComment.belongsToMany(models.ContentComment, { through: models.ContentReply, as: 'reply'});
    };
  
    return contentComment;
  };
  
module.exports = contentComment;
  