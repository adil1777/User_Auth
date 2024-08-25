const nodemailer = require("nodemailer");
const getOtpEmailTemplate = require("./EmailTemplate");
const serverConfig = require("../config/server-config");
require("dotenv").config();

console.log("email=>", serverConfig.mail, "check password=>", serverConfig.pass);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: serverConfig.mail,
    pass: serverConfig.pass,
  },
});

const sendOtpEmail = (email, otp) => {
  const mailOptions = {
    from: serverConfig.mail,
    to: email,
    subject: "Your OTP Code",
    html: getOtpEmailTemplate(email, otp),
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
