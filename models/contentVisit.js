const contentVisit = (sequelize, DataTypes) => {
    const contentVisit = sequelize.define('contentVisit', {
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
        constraints: false,
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
        constraints: false,
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
        constraints: false,
        // onDelete: 'cascade',
        // onUpdate: 'cascade',
      }
    });
  
    contentVisit.associate = (models) => {
    };
  
    return contentVisit;
  };
  
module.exports = contentVisit;
  