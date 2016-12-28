'use strict';

/**
 *
 * @param from string 'MM/DD'
 * @param to string 'MM/DD'
 * @param date object Date
 * @returns {boolean}
 */
module.exports = (from, to, date) => {
  date = date || new Date();
  const [fromMonth, fromDay] = from.split('/').map(n => +n);
  const [toMonth, toDay] = to.split('/').map(n => +n);

  return (
    (date.getMonth() + 1 >= fromMonth && date.getDate() >= fromDay)
    &&
    (date.getMonth() + 1 <= toMonth && date.getDate() <= toDay)
  );
};
