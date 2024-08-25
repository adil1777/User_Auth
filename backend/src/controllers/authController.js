const { models } = require("../models/index");
const bcrypt = require("bcrypt");
const userModel = require("../models/UserModel");
const crypto = require("crypto");
const sendOtpEmail = require("../services/emailService");
const OtpModel = require("../models/OtpModel");
const statusCodes = require("../Utils/statusCodes");
const messages = require("../Utils/messages");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const serverConfig = require("../config/server-config");

//Send-OTP controller
const sendOtpController = async (req, res) => {
  const { email } = req.body;

  const existingUser = await userModel.findOne({ where: { email } });
  if (existingUser) {
    return res
      .status(statusCodes.OK)
      .json({ success: false, message: messages.USER_EXISTS });
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  try {
    await OtpModel.create({ email, otp });
    await sendOtpEmail(email, otp);
    res.status(statusCodes.OK).json({ message: messages.OTP_SENT });
  } catch (error) {
    console.log(error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Verify OTP Controller
const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OtpModel.findOne({
      where: { email },
      order: [["createdAt", "DESC"]],
    });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ message: messages.OTP_INVALID });
    }

    const otpAgeMinutes =
      (new Date() - new Date(otpRecord.createdAt)) / (1000 * 60);
    if (otpAgeMinutes > 5) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ message: messages.OTP_EXPIRED });
    }

    const otpToken = jwt.sign({ email }, serverConfig.JWT_SECRET, {
      expiresIn: "10m",
    });

    res
      .status(statusCodes.OK)
      .json({ message: messages.OTP_VERIFIED, otpToken });
  } catch (error) {
    console.log(error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

//RegisterController
const registerController = async (req, res) => {
  const { username, password } = req.body;
  const email = req.email;
  const existingUser = await userModel.findOne({ where: { email } });
  if (existingUser) {
    return res
      .status(statusCodes.OK)
      .json({ success: false, message: messages.USER_EXISTS });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    await OtpModel.destroy({ where: { email } });

    res
      .status(statusCodes.CREATED)
      .json({ message: messages.REGISTER_SUCCESS, user: newUser });
  } catch (error) {
    console.log(error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

//Login Controller
const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: messages.USER_NOT_FOUND });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(statusCodes.UNAUTHORIZED)
        .json({ message: messages.INVALID_CREDENTIALS });
    }
    const token = jwt.sign({ id: user._id }, serverConfig.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(statusCodes.OK)
      .json({ message: messages.LOGIN_SUCCESS, user, token });
  } catch (error) {
    console.log(error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  sendOtpController,
  verifyOtpController,
  registerController,
  loginController,
};
