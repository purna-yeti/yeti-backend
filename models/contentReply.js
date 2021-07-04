const contentReply = (sequelize, DataTypes) => {
    const contentReply = sequelize.define('contentReply', {
      uuid: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      replyId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'contentComments',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      commentId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'contentComments',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }
    });
  
    contentReply.associate = (models) => {
      contentReply.belongsTo(models.ContentComment, { foreignKey: 'replyId'});
    };
  
    return contentReply;
  };
  
module.exports = contentReply;
  