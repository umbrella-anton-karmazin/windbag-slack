'use strict';
require('dotenv').config();

const Botkit = require('botkit');
const handlers = require('./handlers');
const express = require('express');
const app = express();
const users = require('./repository/db')('db/users');

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

app.set("view engine", "pug");
app.set('views', './views');
app.get('/', function (req, res) {
  users.find({}, (error, list) => {
    res.render('index', { list })
  })
});
app.listen(3000, function () {
  console.log('App listening on port 3000!');
});