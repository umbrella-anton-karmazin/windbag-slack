'use strict';

const assert = require('assert');
const randomParam = require('../../utils/randomParam');

describe('Random Param', () => {

  it('One param', () => {
    assert.equal(randomParam('test'), 'test');
  });

  it('Two params', () => {
    const result = randomParam('test', 'test2');

    assert.equal(result === 'test' || result === 'test2', true);
  });

});
