'use strict';

const assert = require('assert');
const betweenDates = require('../../utils/betweenDates');

describe('Between Dates', () => {

  describe('New Year checking', () => {

    it('Near start', () => {
      assert.equal(betweenDates('12/14', '12/31', new Date('12/13/16')), false);
      assert.equal(betweenDates('12/14', '12/31', new Date('12/14/16')), true);
      assert.equal(betweenDates('12/14', '12/31', new Date('12/15/16')), true);
    });

    it('New Year', () => {
      assert.equal(betweenDates('12/14', '12/31', new Date('12/31/16')), true);
      assert.equal(betweenDates('12/14', '12/31', new Date('01/01/17')), false);
      assert.equal(betweenDates('01/01', '01/14', new Date('12/31/16')), false);
      assert.equal(betweenDates('01/01', '01/14', new Date('01/01/17')), true);

    });

    it('Near end', () => {
      assert.equal(betweenDates('01/01', '01/14', new Date('01/13/17')), true);
      assert.equal(betweenDates('01/01', '01/14', new Date('01/14/17')), true);
      assert.equal(betweenDates('01/01', '01/14', new Date('01/15/17')), false);
    });

  });

  describe('All year', () => {
    it('Random dates', () => {
      assert.equal(betweenDates('01/01', '12/31', new Date('01/13/10')), true);
      assert.equal(betweenDates('01/01', '12/31', new Date('05/22/19')), true);
      assert.equal(betweenDates('01/01', '12/31', new Date('09/03/16')), true);
    });

    it('New Year', () => {
      assert.equal(betweenDates('01/01', '12/31', new Date('12/31/16')), true);
      assert.equal(betweenDates('01/01', '12/31', new Date('01/01/17')), true);
    });
  });
});
