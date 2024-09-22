const Joi = require("joi");
const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = mongoose;

const signUpValidation = Joi.object({
  name: Joi.string().trim().required(),
  userType: Joi.string().trim().required(),
  mobileNumber: Joi.string()
    .trim()
    .required()
    .length(10)
    .pattern(/^[0-9]+$/)
    .messages({
      "string.pattern.base": "mobileNumber must only contain numbers",
    }),
  tenure: Joi.string()
    .trim()
    .required(),
  joinDate: Joi.string()
    .trim()
    .optional(),
  password: Joi.string()
  .min(8)
  .regex(/^(?=.*[0-9])/)
  .required()
  .messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least 1 number',
    'any.required': 'Password is required',
  }),
});

const loginValidation = Joi.object({
  mobileNumber: Joi.string()
  .trim()
  .required()
  .length(10)
  .pattern(/^[0-9]+$/)
  .messages({
    "string.pattern.base": "mobileNumber must only contain numbers"}),
  password: Joi.string().required(),
});
const calculatevalidation = Joi.object({
  totalAmount: Joi.number().required(),
  originalCurrency: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
  tenure: Joi.number().optional(),
  items: Joi.array().required(),
  targetCurrency: Joi.string().trim().required()
  
});

module.exports = {
  signUpValidation,
  calculatevalidation,
  loginValidation,
};
