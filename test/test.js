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
    it('should return FontDescriptor', () => {
      const fd = FontDescriptor.createFromPath(
        '.\\test\\data\\mplus-2m-regular.ttf'
      );
      isFontDescriptor(fd);
    });

    it('should return correct status(M+ 2m Regular)', () => {
      const fd = FontDescriptor.createFromPath(
        './test/data/mplus-2m-regular.ttf'
      );
      assert.ok(
        fd.path.replace(/\\/g, '/').endsWith('/test/data/mplus-2m-regular.ttf')
      );
      assert.equal(fd.family, 'M+ 2m');
      assert.equal(fd.postscriptName, 'mplus-2m-regular');
      assert.equal(fd.style, 'Regular');
      assert.equal(fd.weight, 400);
      assert.equal(fd.width, 5);
      assert.equal(fd.italic, false);
      assert.equal(fd.monospace, false);
    });
  });
});

describe('fontscan', () => {
  it('shoud have a function', () => {
    assert.equal(typeof fontscan.getFontList, 'function');
  });

  describe('#getFontList', () => {
    it('should return fontdescriptor array', () => {
      return fontscan
        .getFontList()
        .then((fdList) => {
          assert.ok(Array.isArray(fdList));
          return fdList;
        })
        .then((fdList) => {
          fdList.forEach((fd) => isFontDescriptor(fd));
        });
    });
  });
});
