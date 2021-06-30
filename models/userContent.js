const userContent = (sequelize, DataTypes) => {
    const userContent = sequelize.define('userContent', {
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
      isLike: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,   
      },
      isDislike: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,   
      },
    });
  
    userContent.associate = (models) => {
      userContent.belongsTo(models.Content, { foreignKey: 'contentId'});
      userContent.belongsTo(models.User, { foreignKey: 'userId'});
    };
  
    return userContent;
  };
  
module.exports = userContent;
  