
const { Sequelize } = require("sequelize");
const colors= require('colors');
const path = require("path");
const fs = require("fs");

const sequelize = new Sequelize("fakeDatabase", "adil", "adil@123", {
  host: "localhost",
  dialect: "mysql", 
});

const models = {};
const modelsPath = path.resolve(__dirname, ".");

fs.readdirSync(modelsPath).forEach((file) => {
  if (file.endsWith(".model.js")) {
    const modelDefiner = require(path.join(modelsPath, file));
    const model = modelDefiner(sequelize);
    models[model.name] = model;
  }
});

sequelize
  .sync()
  .then(() => {
    console.log(`All models were synchronized successfully`.bgCyan.white);
  })
  .catch((err) => {
    console.error("Unable to synchronize the models:", err);
  });

module.exports = {
  sequelize,
  models,
};
