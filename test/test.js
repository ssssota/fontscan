/*
eslint-disable 
  @typescript-eslint/no-var-requires,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-call
*/
const assert = require('assert');
const path = require('path');
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

// todo: テストデータの正解の値をまとめる
// todo: ディレクトリは__dirnameから生成する
// todo: テストデータはisFontDescriptorとまとめた正解値をdeepEqualする
// todo: 各関数の型エラーチェックをする

/*
global
  describe: false
  it: false
*/
describe('FontDescriptor', function () {
  it('should have a static function', () => {
    assert.equal(typeof FontDescriptor.createFromPath, 'function');
  });
  it('should have a constructor', () => {
    assert.equal(typeof FontDescriptor.constructor, 'function');
  });

  describe('#createFromPath', function () {
    it('should return FontDescriptor', () => {
      const fd = FontDescriptor.createFromPath(
        './test/data/mplus-2m-regular.ttf'
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
    it('should return correct status(M+ 1c Light)', () => {
      const fd = FontDescriptor.createFromPath(
        './test/data/mplus-1c-light.ttf'
      );
      assert.ok(
        fd.path.replace(/\\/g, '/').endsWith('/test/data/mplus-1c-light.ttf')
      );
      assert.equal(fd.family, 'M+ 1c light');
      assert.equal(fd.postscriptName, 'mplus-1c-light');
      assert.equal(fd.style, 'Regular');
      assert.equal(fd.weight, 300);
      assert.equal(fd.width, 5);
      assert.equal(fd.italic, false);
      assert.equal(fd.monospace, false);
    });
    it('should return correct status(M+ 2p Black)', () => {
      const fd = FontDescriptor.createFromPath(
        './test/data/mplus-2p-black.ttf'
      );
      assert.ok(
        fd.path.replace(/\\/g, '/').endsWith('/test/data/mplus-2p-black.ttf')
      );
      assert.equal(fd.family, 'M+ 2p black');
      assert.equal(fd.postscriptName, 'mplus-2p-black');
      assert.equal(fd.style, 'Regular');
      assert.equal(fd.weight, 900);
      assert.equal(fd.width, 5);
      assert.equal(fd.italic, false);
      assert.equal(fd.monospace, false);
    });
    it('should return correct status(Roboto)', () => {
      const fd = FontDescriptor.createFromPath(
        './test/data/Roboto-Regular.ttf'
      );
      assert.ok(
        fd.path.replace(/\\/g, '/').endsWith('/test/data/Roboto-Regular.ttf')
      );
      assert.equal(fd.family, 'Roboto');
      assert.equal(fd.postscriptName, 'Roboto-Regular');
      assert.equal(fd.style, 'Regular');
      assert.equal(fd.weight, 400);
      assert.equal(fd.width, 5);
      assert.equal(fd.italic, false);
      assert.equal(fd.monospace, false);
    });
    it('should return correct status(Roboto Italic)', () => {
      const fd = FontDescriptor.createFromPath('./test/data/Roboto-Italic.ttf');
      assert.ok(
        fd.path.replace(/\\/g, '/').endsWith('/test/data/Roboto-Italic.ttf')
      );
      assert.equal(fd.family, 'Roboto');
      assert.equal(fd.postscriptName, 'Roboto-Italic');
      assert.equal(fd.style, 'Italic');
      assert.equal(fd.weight, 400);
      assert.equal(fd.width, 5);
      assert.equal(fd.italic, true);
      assert.equal(fd.monospace, false);
    });
  });
});

describe('fontscan', function () {
  it('shoud have a function', () => {
    assert.equal(typeof fontscan.getFontList, 'function');
  });

  describe('#getFontList', function () {
    this.timeout(10 * 1000);
    it('should return fontdescriptor array', () => {
      return fontscan.getFontList().then((fdList) => {
        assert.ok(Array.isArray(fdList));
        fdList.forEach((fd) => isFontDescriptor(fd));
      });
    });

    it('should return only test data', () => {
      return fontscan
        .getFontList({
          customDirectories: ['./test/data'],
          onlyCustomDirectories: true,
        })
        .then((fdList) => {
          assert.equal(fdList.length, 5);
        });
    });
  });
});
