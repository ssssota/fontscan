/*
eslint-disable 
  @typescript-eslint/no-var-requires,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-call
*/
const assert = require('assert');
const fontscan = require('../dist/index');
const { FontDescriptor } = require('../dist/fontDescriptor');

const isFontDescriptor = (fd) => {
  assert.equal(typeof fd.path, 'string');
  assert.equal(typeof fd.postscriptName, 'string');
  assert.equal(typeof fd.family, 'string');
  assert.equal(typeof fd.width, 'number');
  assert.equal(typeof fd.weight, 'number');
  assert.equal(typeof fd.style, 'string');
  assert.equal(typeof fd.italic, 'boolean');
  assert.equal(typeof fd.monospace, 'boolean');
};

/*
global
  describe: false
  it: false
*/
describe('FontDescriptor', () => {
  it('should have a static function', () => {
    assert.equal(typeof FontDescriptor.createFromPath, 'function');
  });
  it('should have a constructor', () => {
    assert.equal(typeof FontDescriptor.constructor, 'function');
  });

  describe('#createFromPath', () => {
    //FontDescriptor.createFromPath()
  });
});

describe('fontscan', () => {
  it('shoud have a function', () => {
    assert.equal(typeof fontscan.getFontList, 'function');
  });

  describe('#getFontList', () => {
    it('should return fontdescriptor array', async () => {
      const fdList = await fontscan.getFontList();
      assert.ok(Array.isArray(fdList));
      fdList.forEach((fd) => isFontDescriptor(fd));
    });
  });
});
