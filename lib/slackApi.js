'use strict';

const Botkit = require('botkit');
const SlackWebApi = require('botkit/lib/Slack_web_api');

function Api (token) {
  if (!(this instanceof Api)) return new Api();
  console.log('token', token);
  const options = {token};
  this.api = SlackWebApi(Botkit.slackbot({debug: false}), options);
}

Api.prototype.postMessage = function (options, cb) {
  options.token = this.token;
  this.api.chat.postMessage(options, cb);
};

module.exports = Api;
