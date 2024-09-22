'use strict';

// const internalAPI = require('./internalAPI');

module.exports = {
    dbConfig: require('../database/mongo/db.config'),
    messages: require('./codeMsgs'),
    statusCodes: require('./httpCodes'),
    config: require('./config'),
   
};