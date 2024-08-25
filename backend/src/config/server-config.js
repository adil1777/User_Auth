const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  mail: process.env.mail,
  pass: process.env.pass,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_NAME:process.env.DATABASE_NAME,
  USER:process.env.USER,
  PASSWORD:process.env.PASSWORD,
  HOST:process.env.HOST
};
