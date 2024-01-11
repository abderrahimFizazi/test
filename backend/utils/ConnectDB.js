const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, '', {
    host: process.env.DBHOST,
    dialect:  process.env.DB
  });

  const ConnectDB = async () => {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({ force: true }); // Set force: true to drop existing tables and recreate

        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    
  }

  module.exports = { ConnectDB, sequelize };
