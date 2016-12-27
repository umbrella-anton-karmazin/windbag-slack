'use strict';

module.exports = () => {
  const icons = ['snowflake', 'snowman', 'snowman_without_snow', 'champagne', 'christmas_tree', 'santa', 'vzhuh'];
  var choose = Math.floor(Math.random() * icons.length);

  return icons[choose];
};
