const content = (sequelize, DataTypes) => {
  const Content = sequelize.define('content', {
    uuid: {
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    uri: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    hostname: {
      type: DataTypes.STRING,
    },
    pathname: {
      type: DataTypes.STRING,
    },
    search: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    doc: {
      type: DataTypes.TEXT,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      validate: {
        notEmpty: true,
      },
    }
  }
  );

  Content.associate = (models) => {
    Content.belongsToMany(models.User, { through: models.ContentStatus });
    Content.belongsToMany(models.Project, { through: models.ContentStatus });
  };

  return Content;
};

module.exports = content;
