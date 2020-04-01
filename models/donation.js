'use strict';
module.exports = (sequelize, DataTypes) => {
  const donation = sequelize.define('donation', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email_id: DataTypes.STRING,
    instagram_id: DataTypes.STRING,
    facebook_id: DataTypes.STRING,
    donator_fb_id: DataTypes.STRING,
    donator_insta_id: DataTypes.STRING,
    donator_name: DataTypes.STRING
  }, {});
  donation.associate = function (models) {
    // associations can be defined here
  };
  return donation;
};