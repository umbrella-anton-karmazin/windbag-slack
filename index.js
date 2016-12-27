'use strict';

const Botkit = require('botkit');
const handlers = require('./handlers');

// Create bot with disabled statistics.
const controller = Botkit.slackbot({
  debug: false,
  stats_optout: true
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACK_BOT_TOKEN
}).startRTM();

handlers(controller);
