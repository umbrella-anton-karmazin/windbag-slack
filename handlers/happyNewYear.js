'use strict';

const randomParam = require('../utils/randomParam');
const betweenDates = require('../utils/betweenDates');

module.exports = (controller) => {

  let lastUser;
  let lastChannel;

  controller.hears('(.*)', ['message_received', 'ambient'], (bot, message) => {

    if (message.user === lastUser && lastChannel === message.channel) {
      return false;
    }

    // check this year Dec 14 - Dec 31 and Jan 01 - Jan 14
    if (!betweenDates('12/14', '12/31') && !betweenDates('01/01', '01/14')) {
      return false;
    }

    lastUser = message.user;
    lastChannel = message.channel;

    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: randomParam('snowflake', 'snowman', 'snowman_without_snow', 'champagne', 'christmas_tree', 'santa', 'vzhuh')
    });
  });
};
