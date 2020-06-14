import fontkit, { Font } from 'fontkit';

export class FontDescriptor {
  static createFromPath(path: string): FontDescriptor | FontDescriptor[] {
    const font = fontkit.openSync(path);
    if ('fonts' in font) {
      // TrueTypeCollection have multiple fonts in font file
      // eslint-disable-next-line
      return ((font as any).fonts as Font[]).map(
        (f) => new FontDescriptor(f, path)
      );
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

    // eslint-disable-next-line
    const isFixedPitch = (font as any).post?.isFixedPitch;
    this.monospace = isFixedPitch !== 0;

    // eslint-disable-next-line
    const os2 = (font as any)['OS/2'] as OS2;
    if (!os2) return;
    this.width = os2.usWidthClass;
    this.weight = os2.usWeightClass;

    const fsSelection = os2.fsSelection;
    this.italic = !!fsSelection?.italic;
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

interface OS2 {
  xAvgCharWidth: number;
  usWeightClass: number;
  usWidthClass: number;
  fsType: {
    noEmbedding: number;
    viewOnly: number;
    editable: number;
    noSubsetting: number;
    bitmapOnly: number;
  };
  ySubscriptXSize: number;
  ySubscriptYSize: number;
  ySubscriptXOffset: number;
  ySubscriptYOffset: number;
  ySuperscriptXSize: number;
  ySuperscriptYSize: number;
  ySuperscriptXOffset: number;
  ySuperscriptYOffset: number;
  yStrikeoutSize: number;
  yStrikeoutPosition: number;
  sFamilyClass: number;
  panose: number[];
  ulCharRange: number[];
  vendorID: string;
  fsSelection: {
    italic: number;
    underscore: number;
    negative: number;
    outlined: number;
    strikeout: number;
    bold: number;
    regular: number;
    useTypoMetrics: number;
    wws: number;
    oblique: number;
  };
  usFirstCharIndex: number;
  usLastCharIndex: number;
}
