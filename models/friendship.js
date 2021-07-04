const friendship = (sequelize, DataTypes) => {
    const friendship = sequelize.define('friendship', {
      uuid: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      followedId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }
    });
  
    friendship.associate = (models) => {
      friendship.belongsTo(models.User, { foreignKey: 'followedId'});
    };
  
    return friendship;
  };
  
module.exports = friendship;
  