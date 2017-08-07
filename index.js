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
app.use('/static', express.static('public'));
app.get('/', (req, res) => {
  users.find({}, (error, list) => {
    res.render('index', { list })
  })
});
app.use('/favicon.ico', express.static('public/images/favicon.ico'));

// Handle not found page
app.use((req, res) => {
  res.render('error')
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
