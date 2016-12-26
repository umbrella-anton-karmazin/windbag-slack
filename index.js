'use strict';

const Botkit = require('botkit');
const randomHappyNewYear = require('./utils/randomHappyNewYear');
let lastUser;
let lastChannel;

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

  if (message.user === lastUser && lastChannel === message.channel) {
    return false;
  }

  lastUser = message.user;
  lastChannel = message.channel;

  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: randomHappyNewYear()
  });
});
