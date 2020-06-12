import fontkit, { Font } from 'fontkit';

export default class FontDescriptor {
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
  readonly width?: number;
  readonly weight?: number;
  readonly style?: string;
  readonly italic?: boolean;
  readonly monospace?: boolean;

  constructor(font: Font, path: string) {
    this.path = path;
    this.postscriptName = font.postscriptName?.toString();
    this.family = font.familyName?.toString();

    const isFixedPitch = (font as any).post?.isFixedPitch;
    this.monospace = isFixedPitch !== 0;

    const os2 = (font as any)['OS/2'];
    if (!os2) return;
    this.width = os2.usWidthClass;
    this.weight = os2.usWeightClass;

    const fsSelection = os2.fsSelection;
    const regular = fsSelection?.regular;
    const bold = fsSelection?.bold;
    const italic = fsSelection?.italic;
    const oblique = fsSelection?.oblique;
    this.italic = italic || oblique;
    this.style = (
      (regular? 'Regular ': '') +
      (bold? 'Bold ': '') +
      (this.italic? 'Italic': '')
    ).trim();
  }
}