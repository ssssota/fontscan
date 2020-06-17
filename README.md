# fontscan

[![Test](https://github.com/ssssota/fontscan/workflows/Test/badge.svg)](https://github.com/ssssota/fontscan/actions?query=workflow%3ATest)

Get font list in specified directory(default system fonts).

This project respect [font-manager](https://github.com/foliojs/font-manager).

cf.

||fontscan|font-manager|
|---|---|---|
|native|No, **only JS**|Yes, made with C|
|**custom directories**|**Yes**, you can|No, only system fonts|
|accuracy|Not good|**Good**|
|speed|Slow|**Fast**|

[more info...](https://github.com/ssssota/fontscan-vs-font-manager)

## Usage

Get system fonts.

```js
const fontscan = require('fontscan');
console.log(await fontscan.getFontList());

// output
[
  FontDescriptor {
    path: 'C:\\Windows\\Fonts\\AGENCYB.TTF',
    postscriptName: 'AgencyFB-Bold',
    family: 'Agency FB',
    monospace: false,
    width: 3,
    weight: 700,
    italic: false,
    style: 'Bold'
  },
  FontDescriptor {
    path: 'C:\\Windows\\Fonts\\AGENCYR.TTF',
    postscriptName: 'AgencyFB-Reg',
    family: 'Agency FB',
    monospace: false,
    width: 3,
    weight: 400,
    italic: false,
    style: 'Regular'
  },
  ... more items ]
```

Fonts in specified directory.

Note: We recommend that you do not specify the root directory, as custom directories are searched recursively.

```js
const fonts = await fontscan.getDirectoryFonts('/Library/Fonts');
const fonts = await fontscan.getDirectoriesFonts([
  `C:\\Users\\${username}\\Fonts`,
  `D:\\Fonts`
]);
```

## API

### `fontscan`

#### `fontscan.getFontList(options?): Promise<FontDescriptor[]>`

Get fontdescriptors that installed and in specified directories.

- `options`
  - `customDirectories`
    - `string[]`
    - default: `[]`
  - `onlyCustomDirectories`
    - `boolean`
    - default: `false`

#### `fontscan.getDescriptorFromPaths(fontPaths): Promise<FontDescriptor[]>`

Get fontdescriptors that specified files.

- `fontPaths`
  - `string[]`

#### `fontscan.getDirectoryFonts(dirPath): Promise<FontDescriptor[]>`

Get fontdescriptors that in specified directory.

- `dirPath`
  - `string`

#### `fontscan.getDirectoriesFonts(dirPaths): Promise<FontDescriptor[]>`

Get fontdescriptors that in specified directories.

- `dirPaths`
  - `string[]`

#### `fontscan.getInstalledFonts(): Promise<FontDescriptor[]>`

Get fontdescriptors that installed.

### `FontDescriptor`

Font descriptor has basic font informations.

#### Properties

- `path: string`
- `family: string`
- `postscriptName: string`
- `width: number`
  - detail [microsoft document](https://docs.microsoft.com/en-us/typography/opentype/spec/os2#uswidthclass)
- `weight: number`
  - detail [microsoft document](https://docs.microsoft.com/en-us/typography/opentype/spec/os2#usweightclass)
- `style: string`
  - e.g. `Regular`, `Bold`, `Italic`, `Bold italic`
- `italic: boolean`
- `monospace: boolean`

## Contribution

1. Fork
2. Create a feature branch
3. Commit your changes
4. Rebase your local changes against the master branch
5. Run test suite with the `npm test` command and confirm that it passes
6. Create new Pull Request

**Please tell me if my English is wrong**

## LICENSE

[MIT](LICENSE)
