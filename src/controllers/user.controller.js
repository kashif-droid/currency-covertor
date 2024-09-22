"use strict";
const { statusCodes, messages } = require("../configs");
const codeMsgs = require("../configs/codeMsgs");
const httpCodes = require("../configs/httpCodes");
const {
  userService,
} = require(`../services/mongo`);
const { response } = require("../middleware");
class UserController { }
const {currencyCode} = require("../constants")
UserController.signUp = async (req, res, next) => {
  try {
    let  body  = req?.body;
    const isUserExists = await userService.findUserByMobile(
      body?.mobileNumber
    );
    if (isUserExists) {
      return response.errors(
        req,
        res,
        httpCodes.HTTP_BAD_REQUEST,
        codeMsgs.userExist
      );
    }
    let result = await userService.signUp(body);
    return response.success(
      req,
      res,
      result?.code || statusCodes.HTTP_OK,
      result?.data,
      result?.message
    );
  } catch (err) {
    next(err);
  }
};



UserController.loginWithPassword = async (req, res, next) => {
  try {
    let body = req?.body;
    let result = await userService.loginWithPassword(body);

    return response.success(
      req,
      res,
      result?.code || statusCodes.HTTP_OK,
      result?.data,
      result?.message
    );
  } catch (err) {
    console.log("err", err);
    next(err);
  }
};

UserController.calculateAmountDetails = async (req, res, next) => {
  let params = req?.body
  params.userType = req?.user?.userType
  console.log(currencyCode,params.targetCurrency)
  let findTargetCurrency = currencyCode.includes(params?.targetCurrency)
  let findOriginalCurrency = currencyCode.includes(params?.originalCurrency)
  if(!findTargetCurrency){
    return response.errors(
      req,
      res,
      httpCodes.HTTP_BAD_REQUEST,
      "Invalid target currency Code"
      
    );
  }
  if(!findOriginalCurrency){
    return response.errors(
      req,
      res,
      httpCodes.HTTP_BAD_REQUEST,
      "Invalid original currency Code"
    );
  }

  const userAccount = await userService.calculateAmount(params);
 
  return response.success(
    req,
    res,
    statusCodes.HTTP_OK,
    userAccount?.data,
    messages.dataFetched
  );

}

module.exports = UserController;