const analyzedContent = (sequelize, DataTypes) => {
  const AnalyzedContent = sequelize.define('analyzedContent', {
    uuid: {
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    clean_uri: {
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
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      validate: {
        notEmpty: true,
      },
    }
  }
  );

  AnalyzedContent.associate = (models) => {
    AnalyzedContent.hasMany(models.Content);
  };

  return AnalyzedContent;
};

module.exports = analyzedContent;
