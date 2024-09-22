const { statusCodes, thirdpartyConfig } = require("./../configs");
const userService = require(`../services/mongo/user.service`);
const jwt = require("jsonwebtoken");
const unAuthorizedResponse = {
  status: statusCodes.HTTP_UNAUTHORIZED,
  message: "unauthorized.",
};

const tokenExpiredResponse = {
  status : statusCodes.HTTP_UNAUTHORIZED,
  message: "Token expired."
}

const invalidTokenResponse = {
  status : statusCodes.HTTP_UNAUTHORIZED,
  message: "Invalid token."
}

const sessionExpiredResponse = {
  status : statusCodes.HTTP_UNAUTHORIZED,
  message: "Session expired."
}
module.exports = {
  validateToken: async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        next(invalidTokenResponse);
      }

      jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
          // update session inactive or DELETE by accessToken
          if(err.name == "TokenExpiredError"){
          userService.updateSessionDELETED(token);
            next(tokenExpiredResponse);
          }else if(err.name == "JsonWebTokenError" && err.message == "jwt must be provided"){
            next(invalidTokenResponse);
          }else{
            next(unAuthorizedResponse);
          }
         
        }
        req.user = user;
        next();
      });
    } catch (err) {
      console.log("error msgs", err.message);
      next(unAuthorizedResponse);
    }
  }
}
