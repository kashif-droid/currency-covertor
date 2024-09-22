'use strict';

const mongoose = require("mongoose");
const { USER_STATUS } = require("../../../constants");
const { Schema } = mongoose;



module.exports = new Schema({
  name: {
    type: String,
    trim: true,
    required:true
  },
  userType: {
    type: String,
    trim: true,
    enum :["employee","customer","affiliate"],
    required:true
  },
  tenure: {
    type: Number,
    required: true,
    trim: true
  },
  joinDate: {
    type: Date,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
 
  mobileNumber: {
    type: String,
    trim: true
  },
  
}, {
  timestamps: true
});