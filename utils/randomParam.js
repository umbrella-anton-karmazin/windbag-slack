'use strict';

module.exports = (...icons) => {
  const choose = Math.floor(Math.random() * icons.length);

  return icons[choose];
};
