const content = (sequelize, DataTypes) => {
  const Content = sequelize.define('content', {
    uuid: {
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    uri: {
      type: DataTypes.STRING(2048),
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
    hash: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      validate: {
        notEmpty: true,
      },
    },
    analyzedContentId: {
      type: DataTypes.INTEGER,
      primaryKey: false,
      references: {
        model: 'analyzedContents',
        key: 'id'
      },
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  }
  );

  Content.associate = (models) => {
    Content.belongsToMany(models.User, { through: models.ContentStatus });
    Content.belongsToMany(models.Project, { through: models.ContentStatus });
    Content.belongsTo(models.AnalyzedContent);

  };

  return Content;
};

module.exports = content;
