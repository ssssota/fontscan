import fontkit, { Font } from 'fontkit';

export class FontDescriptor {
  static createFromPath(path: string): FontDescriptor | FontDescriptor[] {
    const font = fontkit.openSync(path);
    if ('fonts' in font) {
      // TrueTypeCollection have multiple fonts in font file
      return ((font as any).fonts as Font[]).map(f => new FontDescriptor(f, path))
    } else {
      return new FontDescriptor(font, path);
    }
  }

  readonly path: string;
  readonly family: string;
  readonly postscriptName: string;
  readonly width: number = 500;
  readonly weight: number = 3;
  readonly style: string = 'Regular';
  readonly italic: boolean = false;
  readonly monospace: boolean = false;

  constructor(font: Font, path: string) {
    this.path = path;
    this.postscriptName = fixIncorrectString(font.postscriptName);
    this.family = fixIncorrectString(font.familyName);
    this.style = fixIncorrectString(font.subfamilyName);

    const isFixedPitch = (font as any).post?.isFixedPitch;
    this.monospace = isFixedPitch !== 0;

    const os2 = (font as any)['OS/2'];
    if (!os2) return;
    this.width = os2.usWidthClass;
    this.weight = os2.usWeightClass;

    const fsSelection = os2.fsSelection;
    this.italic = !!(fsSelection?.italic);
  }
}

function fixIncorrectString(str: string | Buffer) {
  if (typeof str === 'string') return str;
  let newStr = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== 0) newStr += Buffer.from([str[i]]).toString();
  }
  return newStr;
}