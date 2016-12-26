'use strict';

module.exports = () => {
  const icons = ['snowflake', 'snowman', 'snowman_without_snow', 'champagne', 'christmas_tree'];
  var choose = Math.floor(Math.random() * icons.length);

  return icons[choose];
};
