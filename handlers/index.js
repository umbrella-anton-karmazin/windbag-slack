'use strict';

const happyNewYear = require('./happyNewYear');
const hello = require('./hello');

module.exports = (controller) => {
  happyNewYear(controller);
  hello(controller);
};
