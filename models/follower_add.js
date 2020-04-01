'use strict';
module.exports = (sequelize, DataTypes) => {
  const follower_add = sequelize.define('follower_add', {
    date: DataTypes.DATE,
    amount: DataTypes.STRING
  }, {});
  follower_add.associate = function(models) {
    // associations can be defined here
  };
  return follower_add;
};