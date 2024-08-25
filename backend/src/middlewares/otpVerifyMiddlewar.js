const jwt = require("jsonwebtoken");
const serverConfig = require("../config/server-config");
const messages = require("../Utils/messages");
const statusCodes = require("../Utils/statusCodes");

const verifyOtpToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(statusCodes.UNAUTHORIZED)
      .json({ message: messages.MISSING_AUTH_HEADER });
  }

  let token = authHeader.split(" ")[1]; 

  jwt.verify(token, serverConfig.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(statusCodes.UNAUTHORIZED)
        .json({ message: messages.INVALID_OTP_TOKEN });
    }

    console.log("decoded=>", decoded);
    req.email = decoded.email; 
    next();
  });
};

module.exports = verifyOtpToken;
