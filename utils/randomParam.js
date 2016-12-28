'use strict';

module.exports = (...params) => {
  const choose = Math.floor(Math.random() * params.length);

  return params[choose];
};
