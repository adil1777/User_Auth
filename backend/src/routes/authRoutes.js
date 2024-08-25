const express = require("express");
const {
  registerController,
  loginController,
  sendOtpController,
  verifyOtpController,
} = require("../controllers/authController");

const {
  validateOtpRequest,
  validateRegisterRequest,
  validateLoginRequest,
  validateOtpVerification,
} = require("../Utils/ValidationSchema");
const verifyOtpToken = require("../middlewares/otpVerifyMiddlewar");
const router = express.Router();


// Send OTP to user
router.post("/send-otp", validateOtpRequest, sendOtpController);

//verify OTP
router.post("/verify-otp", validateOtpVerification,verifyOtpController);

// Register
router.post(
  "/register",
  verifyOtpToken,validateRegisterRequest,
  registerController
);

// Login
router.get("/login", validateLoginRequest,loginController);

module.exports = router;
