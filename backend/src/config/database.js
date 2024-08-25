const { Sequelize } = require("sequelize");
const serverConfig = require("./server-config");

const sequelize = new Sequelize( serverConfig.DATABASE_NAME, serverConfig.USER, serverConfig.PASSWORD, {
  host: serverConfig.HOST,
  dialect: "mysql",
});

module.exports = sequelize;
