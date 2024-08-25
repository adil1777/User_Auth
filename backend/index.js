const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./models/UserModel");
const db = require("./models/index");
const sequelize = require("./config/database");
const serverConfig = require("./config/server-config");


dotenv.config();
const app = express();
app.use(cors());

// Middleware
app.use(bodyParser.json());


//Register || login
app.use("/api/v1/auth", require("./routes/authRoutes"));


sequelize
  .sync({ force: false })
  .then(() => {
    console.log(`Databse synced`.bgGreen.white);
  })
  .catch((err) => {
    console.error(`unable to sync database`, err);
  });

// Routes for testing 
app.get("/", async (req, res) => {
  try {
    res.send("Hello Word");
  } catch (error) {
    res.status(500).send(error.message);
  }
});



const PORT = serverConfig.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`.bgGreen.white);
});
