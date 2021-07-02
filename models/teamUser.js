const teamUser = (sequelize, DataTypes) => {
    const USER_ROLE = ['OWNER', 'EDITOR', 'MEMBER'];
    const REQUEST_STATUS = ['PENDING', 'REJECTED', 'SUSPENDED', 'APPROVED'];

    const teamUser = sequelize.define('teamUser', {
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
        type: DataTypes.ENUM(USER_ROLE),
        defaultValue: 'MEMBER',
      },
      requestStatus: {
        type: DataTypes.ENUM(REQUEST_STATUS),
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
    teamUser.USER_ROLE = USER_ROLE;
    teamUser.REQUEST_STATUS = REQUEST_STATUS;
  
    return teamUser;
  };
  
module.exports = teamUser;
  