'use strict';

let CONFIG = require('../../configs/config')(process.env.CONFIG_ARG);
const mongoose = require("mongoose");
module.exports = async () => {
  await mongoose.connect(`mongodb+srv://Dinesh:Dinesh1708@cluster0.hg9p0.mongodb.net/currencyExchange?retryWrites=true&w=majority&appName=Cluster0`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
  let db = mongoose.connection;
  db.on("error", err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running");
    throw new Error(err);
  });
  console.log("Database connection established.");
};

