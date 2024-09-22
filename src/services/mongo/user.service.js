const { USER_TYPE, CATEGORY } = require("../../constants");
const {
  user
} = require("../../database/mongo/models");
const { statusCodes, messages } = require("./../../configs");
const {
  generateAccessToken,
} = require("./../../utils");
const { getCurrencyExchageList } = require("../../externalServices/index");
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Cache TTL set to 10 minutes
class UserService { }
//   try {
//     // Check if the provided email domain exists in the restricted domains collection
//     const restrictedDomain = await restricted_domains.findOne({
//       restrictedDomain: emailDomain,
//     });

//     return !!restrictedDomain; // Return true if it's a restricted domain, false otherwise
//   } catch (err) {
//     throw new Error(err);
//   }
// };

UserService.findUserByMobile = async (mobileNumber) => {
  try {
    const userdata = await user.findOne({ mobileNumber: mobileNumber });

    if (!userdata) {
      return null;
    }
    return {
      code: statusCodes.HTTP_OK,
      message: "User",
      data: userdata,
    };
  } catch (e) {
    throw new Error(e);
  }
};

UserService.signUp = async (payload) => {
  try {


    let userData = new user(payload);
    let data = await userData.save();
    delete data.password;

    if (!data) {
      return {
        code: statusCodes.HTTP_INTERNAL_SERVER_ERROR,
        message: messages.userNotCreate,
      };
    }

    data = JSON.parse(JSON.stringify(data));

    return {
      code: statusCodes.HTTP_CREATED,
      message: messages.userRegistered,
      data,
    };
  } catch (err) {
    throw new Error(err);
  }
};

UserService.loginWithPassword = async (body) => {
  try {
    const { mobileNumber, password } = body;

    const findUser = await user.findOne(
      {
        mobileNumber: mobileNumber
      }
    ).lean();

    if (!findUser) {
      return {
        code: statusCodes.HTTP_NOT_FOUND,
        message: messages.userNotExist,
      };
    }

    if (body?.password != findUser?.password) {
      return {
        code: statusCodes.HTTP_CONFLICT,
        message: messages.incorrectPassword,
      };
    }

    findUser.token = generateAccessToken({
      id: findUser?._id,
      userType: findUser?.userType,
      mobileNumber: mobileNumber
    });
    delete findUser?.password
    return {
      code: statusCodes.HTTP_OK,
      message: messages.loginSuccess,
      data: findUser,
    };
  } catch (err) {
    throw new Error(err);
  }
};

UserService.calculateAmount = async (params) => {
  try {
    let discountValue = await discountApply(params); // discount calculate
    console.log(discountValue)
    // let find = getCachedExchangeRate(params?.originalCurrency,
    //   params.targetCurrency)
    //   console.log("Hi",find)
    let { status, finalAmount } = await getCachedExchangeRate(
      discountValue?.discountValue,
      params?.originalCurrency,
      params.targetCurrency
    ); // currency conversion
    if (status) {
      return {
        status: true,
        statusCode: statusCodes?.HTTP_OK,
        message: messages.success,
        data: {
          payableAmount: finalAmount,
          discountedPercentage: discountValue?.Percentage,
          ...params
        },
      };
    } else {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: messages.invalidCurrency,
        data: [],
      };
    }
  } catch (err) {
    console.log("err", err);
    return {
      status: false,
      statusCode: statusCodes?.HTTP_INTERNAL_SERVER_ERROR,
      message: err,
      data: [],
    };
  }

}
// const currencyConversion = async (amount, originalCurrency, targetCurrency) => {
//   //Currency Conversion Logic
//   let allCurrencyList = await getCurrencyExchageList({
//     originalCurrency: originalCurrency,
//   });
//   if (
//     allCurrencyList &&
//     allCurrencyList.result &&
//     allCurrencyList.result == "success"
//   ) {
//     if (allCurrencyList.conversion_rates[targetCurrency]) {
//       let convertAmount =
//         amount * allCurrencyList.conversion_rates[targetCurrency];
//       return { status: true, finalAmount: convertAmount };
//     } else {
//       return { status: false, finalAmount: 0 };
//     }
//   } else {
//     return { status: false, finalAmount: 0 };
//   }
// };
const discountApply = async (params) => {
  //Discounts logic
  let discountValue = params?.totalAmount;
  console.log("1-", params, discountValue)
  let Percentage
  if (params?.userType == USER_TYPE?.CUSTOMER && +params?.tenure >= 2 && params?.category != CATEGORY?.GROCERIES && params?.totalAmount < 100) {
    // If user has been a customer for over 2 years, they get a 5% discount.
    discountValue *= 0.95; // 5% discount
    Percentage = "5%"
    console.log("2-", discountValue)
  } else if (params?.userType == USER_TYPE?.EMPLOYEE && params.category != CATEGORY.GROCERIES && params?.totalAmount < 100) {
    // If the user is an employee of the store, they get a 30% discount.
    discountValue *= 0.7; // 30% discount
    Percentage = "30%"
    console.log("3-", discountValue)
  } else if (params?.userType == USER_TYPE?.AFFILIATE && params?.category != CATEGORY?.GROCERIES && params?.totalAmount < 100) {
    //If the user is an affiliate of the store, they get a 10% discount.
    discountValue *= 0.9; // 10% discount
    Percentage = "10%"
    console.log("4-", discountValue)
  }

  if (params?.totalAmount >= 100) {
    //For every $100 on the bill, there is a $5 discount.
    let flatDiscount = Math.floor(params?.totalAmount / 100) * 5;
    Percentage = "$5"
    discountValue -= flatDiscount;
    console.log("5-", discountValue)
  }
  return {
    discountValue: discountValue,
    discountedPercentage: Percentage
  };
};
const getCachedExchangeRate = async (amount, originalCurrency, targetCurrency) => {
  const cacheKey = `${originalCurrency}_${targetCurrency}`; 
  let exchangeRate = cache.get(cacheKey);   // node-cache used for reduce api call for rate api 
  if (!exchangeRate) {
    console.log('Fetching new exchange rate...');
    exchangeRate = await getCurrencyExchageList({ originalCurrency, targetCurrency });
    cache.set(cacheKey, exchangeRate, 500);
  } else {
    console.log('Using cached exchange rate...');
  }

  if (exchangeRate) {
    return {
      status: true, finalAmount: amount * exchangeRate
    }
  } else {

    return { status: false, finalAmount: 0 };
  }
};


module.exports = UserService;
