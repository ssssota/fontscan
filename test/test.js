/*
eslint-disable 
  @typescript-eslint/no-var-requires,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/restrict-template-expressions
*/
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const fontscan = require('../dist/index');
const { FontDescriptor } = require('../dist/fontDescriptor');
const expected = require('./expected.json');

const isFontDescriptor = (fd) => {
  assert.ok(fs.existsSync(fd.path));
  assert.equal(typeof fd.path, 'string');
  assert.equal(typeof fd.postscriptName, 'string');
  assert.equal(typeof fd.family, 'string');
  assert.equal(typeof fd.width, 'number');
  assert.equal(typeof fd.weight, 'number');
  assert.equal(typeof fd.style, 'string');
  assert.equal(typeof fd.italic, 'boolean');
  assert.equal(typeof fd.monospace, 'boolean');
};
const fdSorter = (a, b) => {
  if (a.path.toLowerCase() < b.path.toLowerCase()) return -1;
  else if (a.path.toLowerCase() > b.path.toLowerCase()) return 1;
  if (a.postscriptName < b.postscriptName) return -1;
  else return 1;
};

/*
global
  describe: false
  it: false
*/
describe('FontDescriptor', function () {
  it('should have functions', () => {
    assert.equal(typeof FontDescriptor.createFromPath, 'function');
    assert.equal(typeof FontDescriptor.constructor, 'function');
  });

  describe('#createFromPath', function () {
    expected.fonts.map((fontdata) => {
      const _fontdata = Object.assign({}, fontdata);
      it(`should return correct status for ${_fontdata.family}`, () => {
        const fd = FontDescriptor.createFromPath(
          path.join('test', _fontdata.path)
        );
        isFontDescriptor(fd);
        _fontdata.path = path.join(__dirname, _fontdata.path);
        assert.deepEqual(fd, _fontdata);
      });
    });

    it('should throw error', () => {
      assert.throws(FontDescriptor.createFromPath.bind(null, 1));
      assert.throws(
        FontDescriptor.createFromPath.bind(null, './not-exist-file.ttf')
      );
      assert.throws(
        FontDescriptor.createFromPath.bind(null, './test/data/not-font.ttf')
      );
    });
  });
});

describe('fontscan', function () {
  it('should have functions', () => {
    assert.equal(typeof fontscan.getDescriptorFromPaths, 'function');
    assert.equal(typeof fontscan.getDirectoryFonts, 'function');
    assert.equal(typeof fontscan.getDirectoriesFonts, 'function');
    assert.equal(typeof fontscan.getInstalledFonts, 'function');
    assert.equal(typeof fontscan.getFontList, 'function');
  });

  describe('#getDescriptorFromPaths', function () {
    it('should return font descriptors', () => {
      return fontscan
        .getDescriptorFromPaths(
          expected.fonts.map((fontdata) => path.join('test', fontdata.path))
        )
        .then((fdList) => {
          fdList.map((fd) => isFontDescriptor(fd));
          const _expected = expected.fonts.map((fontdata) => {
            const _fontdata = Object.assign({}, fontdata);
            _fontdata.path = path.join(__dirname, _fontdata.path);
            return _fontdata;
          });
          assert.deepEqual(fdList, _expected);
        });
    });
    it('should throw error', (done) => {
      fontscan.getDescriptorFromPaths('not array').then(
        () => {
          assert.fail();
          done();
        },
        () => {
          assert.ok(true);
          done();
        }
      );
    });
  });

  describe('#getDirectoryFonts', function () {
    it('should return font descriptors', () => {
      return fontscan.getDirectoryFonts('./test/data').then((fdList) => {
        fdList.map((fd) => isFontDescriptor(fd));
        const _expected = expected.fonts.map((fontdata) => {
          const _fontdata = Object.assign({}, fontdata);
          _fontdata.path = path.join(__dirname, _fontdata.path);
          return _fontdata;
        });
        assert.deepEqual(fdList.sort(fdSorter), _expected.sort(fdSorter));
      });
    });
    it('should throw error 01', (done) => {
      fontscan.getDirectoryFonts(1).then(
        () => {
          assert.fail();
          done();
        },
        () => {
          assert.ok(true);
          done();
        }
      );
    });
    it('should throw error 02', (done) => {
      fontscan.getDirectoryFonts('./not-exists-directory').then(
        () => {
          assert.fail();
          done();
        },
        () => {
          assert.ok(true);
          done();
        }
      );
    });
  });

  describe('#getDirectoriesFonts', function () {
    it('should return font descriptors', () => {
      return fontscan.getDirectoriesFonts(['./test/data']).then((fdList) => {
        fdList.map((fd) => isFontDescriptor(fd));
        const _expected = expected.fonts.map((fontdata) => {
          const _fontdata = Object.assign({}, fontdata);
          _fontdata.path = path.join(__dirname, _fontdata.path);
          return _fontdata;
        });
        assert.deepEqual(fdList.sort(fdSorter), _expected.sort(fdSorter));
      });
    });
    it('should throw error 01', (done) => {
      fontscan.getDirectoriesFonts('./test/data').then(
        () => {
          assert.fail();
          done();
        },
        () => {
          assert.ok(true);
          done();
        }
      );
    });
    it('should throw error 02', (done) => {
      fontscan.getDirectoriesFonts([1, 2, 3]).then(
        () => {
          assert.fail();
          done();
        },
        () => {
          assert.ok(true);
          done();
        }
      );
    });
  });

  describe('#getInstalledFonts', function () {
    this.timeout(10 * 1000);
    it('should return font descriptors', () => {
      return fontscan.getInstalledFonts().then((fdList) => {
        assert.ok(Array.isArray(fdList));
        fdList.forEach((fd) => isFontDescriptor(fd));
      });
    });
  });

  describe('#getFontList', function () {
    this.timeout(10 * 1000);
    it('should return font descriptors', () => {
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
          assert.equal(fdList.length, expected.fonts.length);
        });
    });

    it('should throw error 01', (done) => {
      fontscan.getFontList('not object').then(
        () => {
          assert.fail();
          done();
        },
        () => {
          assert.ok(true);
          done();
        }
      );
    });
    it('should throw error 02', (done) => {
      fontscan.getFontList({ customDirectories: 'not array' }).then(
        () => {
          assert.fail();
          done();
        },
        () => {
          assert.ok(true);
          done();
        }
      );
    });
    it('should throw error 03', (done) => {
      fontscan.getFontList({ onlyCustomDirectories: 'not boolean' }).then(
        () => {
          assert.fail();
          done();
        },
        () => {
          assert.ok(true);
          done();
        }
      );
    });
  });
});
