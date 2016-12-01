'use strict';

const log4js = require('log4js');
const logger = exports = module.exports = {};

log4js.configure({
  appenders: [
    {
      "type": "file",
      "category": "app",
      "filename": "./logs/app.log",
      "pattern": "-yyyy-MM-dd"
    },
    {
      "type": "file",
      "category": "error",
      "filename": "./logs/error.log",
      "pattern": "-yyyy-MM-dd"
    }
  ]
});
logger.app = log4js.getLogger('app');
logger.error = log4js.getLogger('error');
