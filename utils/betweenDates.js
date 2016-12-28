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
  const [fromM, fromD] = from.split('/').map(n => +n);
  const [toM,toD ] = to.split('/').map(n => +n);

  return (
    (fromM === date.getMonth() + 1 && date.getDate() > fromD)
    ||
    (toM === date.getMonth() + 1 && date.getDate() < toD)
  );
};
