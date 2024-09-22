
const jwt = require("jsonwebtoken");
module.exports = {
  

  generateAccessToken: function (data, expiry = null) {
    return jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: expiry || process.env.JWT_EXPIRE_TIME,
    });
  },
  
};
