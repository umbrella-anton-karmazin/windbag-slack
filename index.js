'use strict';

const Botkit = require('botkit');
const randomHappyNewYear = require('./utils/randomHappyNewYear');

// Create bot with disabled statistics.
const controller = Botkit.slackbot({
  debug: false,
  stats_optout: true
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACK_BOT_TOKEN
}).startRTM();

controller.hears('(.*)', ['message_received', 'ambient'], (bot, message) => {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: randomHappyNewYear()
  });
});
