
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); 

const userModel = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
  { timestamps: true,
    updatedAt:true,
  },
);

module.exports = userModel;