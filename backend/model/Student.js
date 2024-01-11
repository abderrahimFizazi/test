const {  DataTypes } = require('sequelize');
const { sequelize } = require('../utils/ConnectDB');

const Student = sequelize.define('Student', {
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

module.exports = Student
