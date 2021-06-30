const teamUser = (sequelize, DataTypes) => {
    const teamUser = sequelize.define('teamUser', {
      uuid: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      teamId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: 'team',
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
      userRole: {
        type: DataTypes.ENUM('OWNER', 'EDITOR', 'MEMBER'),
        defaultValue: 'MEMBER',
      },
      requestStatus: {
        type: DataTypes.ENUM('PENDING', 'REJECTED', 'SUSPENDED', 'APPROVED'),
        defaultValue: 'PENDING',
      },
      isFavourite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,   
      },
    });
  
    teamUser.associate = (models) => {
      teamUser.belongsTo(models.Team, { foreignKey: 'teamId'});
      teamUser.belongsTo(models.User, { foreignKey: 'userId'});
    };
  
    return teamUser;
  };
  
module.exports = teamUser;
  