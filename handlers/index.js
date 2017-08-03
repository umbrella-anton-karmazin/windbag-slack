'use strict';

const quiz = require('./quiz');
const hello = require('./hello');

module.exports = (controller) => {
  quiz(controller);
  hello(controller);
};
