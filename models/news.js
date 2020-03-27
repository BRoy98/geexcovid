'use strict';
module.exports = (sequelize, DataTypes) => {
  const news = sequelize.define('news', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    channel: DataTypes.STRING,
    type: DataTypes.INTEGER,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
    srtt: DataTypes.STRING
  }, {});
  news.associate = function (models) {
    // associations can be defined here
  };
  return news;
};