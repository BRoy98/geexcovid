'use strict';
module.exports = (sequelize, DataTypes) => {
  const covid_data = sequelize.define('covid_data', {
    date_in: DataTypes.DATE,
    total_case: DataTypes.INTEGER,
    hospital: DataTypes.INTEGER,
    recover: DataTypes.INTEGER,
    death: DataTypes.INTEGER
  }, {});
  covid_data.associate = function(models) {
    // associations can be defined here
  };
  return covid_data;
};