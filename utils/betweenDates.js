'use strict';

/**
 *
 * @param from string 'MM/DD'
 * @param to string 'MM/DD'
 *
 * @returns {boolean}
 */
module.exports = (from, to) => {
  const now = new Date();
  const [fromM, fromD] = from.split('/').map(n => +n);
  const [toM,toD ] = to.split('/').map(n => +n);

  return (
    (fromM === now.getMonth() + 1 && now.getDate() > fromD)
    ||
    (toM === now.getMonth() + 1 && now.getDate() < toD)
  );
};
