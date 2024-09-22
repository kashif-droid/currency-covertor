const { userController } = require("../../controllers/index");
const { verifyToken } = require("../../middleware");

const express = require("express");
const userRoutes = express.Router();

let validator = require("express-joi-validation").createValidator({
  passError: true,
});
const {
  signUpValidation,
  loginValidation,
  accountValidator,
  calculatevalidation
} = require("../../validators/user.validator");


userRoutes.post(
  "/signup",
  validator.body(signUpValidation),
  userController.signUp
);

userRoutes.post(
  "/login",
  validator.body(loginValidation),
  userController.loginWithPassword
);


userRoutes.post("/calculator",verifyToken.validateToken,  validator.body(calculatevalidation),  userController.calculateAmountDetails)

module.exports = userRoutes;
