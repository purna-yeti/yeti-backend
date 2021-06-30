const message = (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
      uuid: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      text: {
        type: DataTypes.STRING
      },
    });
  
    Message.associate = (models) => {
      Message.belongsTo(models.User);
    };
  
    return Message;
  };
  
module.exports = message;
  