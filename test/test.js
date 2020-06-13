const assert = require('assert')
const fontscan = require('../dist/index');
const FontDescriptor = require('../dist/fontDescriptor').default;

describe('FontDescriptor', () => {
  it('should have a static function', () => {
    assert.equal(typeof FontDescriptor.createFromPath, 'function');
  });
  it('should have a constructor', () => {
    assert.equal(typeof FontDescriptor.constructor, 'function');
  });

  const isFontDescriptor = fd => {
    assert.equal(typeof fd.path, 'string');
    assert.equal(typeof fd.postscriptName, 'string');
    assert.equal(typeof fd.family, 'string');
    // assert.equal(typeof fd.width, 'number');
    // assert.equal(typeof fd.weight, 'number');
    // assert.equal(typeof fd.style, 'string');
    // assert.equal(typeof fd.italic, 'boolean');
    // assert.equal(typeof fd.monospace, 'boolean');
  }

  describe('#createFromPath', () => {
    //FontDescriptor.createFromPath()
  })
});

describe('fontscan test', () => {
  it('shoud have a function', () => {
    assert.equal(typeof fontscan.getFontList, 'function');
  });
});
