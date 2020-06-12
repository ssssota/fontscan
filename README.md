# Fontinfo

Get font list in specified directory(default system fonts).

This project respect [font-manager](https://github.com/foliojs/font-manager).

cf.

||is native|accuracy|Custom directory|
|---|---|---|---|
|Fontinfo|No. Only node.js|Maybe not accurate|Yes. Not only installed font|
|font-manager|Yes. Made with C language|Maybe accurate|No. Only installed font|

## Usage

Get system fonts.

```js
const fontinfo = require('fontinfo');
console.log(await fontinfo.getFontList());

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
await fontinfo.getFontList({
  customDirectories: [
    `C:\\Users\\${username}\\Fonts`,
    `D:\\Fonts`
  ],
  onlyCustomDirectories: true
})
```

## API

### `fontinfo.getFontList(options?): Promise<FontDescriptor[]>`

- `options`
  - `customDirectories`
    - `string[]`
  - `onlyCustomDirectories`
    - `boolean`

### `FontDescriptor`

Font descriptor has basic font informations.

#### Properties

- `path: string;`
- `family: string;`
- `postscriptName: string;`
- `width?: number;`
- `weight?: number;`
- `style?: string;`
- `italic?: boolean;`
- `monospace?: boolean;`