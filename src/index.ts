import getSystemFonts from 'get-system-fonts';
import { FontDescriptor } from './fontDescriptor';
import path from 'path';
import fs from 'fs';

export const getFontList = async (options?: {
  customDirectories?: string[];
  onlyCustomDirectories?: boolean;
}): Promise<FontDescriptor[]> => {
  if (options && typeof options !== 'object') {
    throw new TypeError('options must be `object`');
  }
  if (options?.customDirectories && !Array.isArray(options.customDirectories)) {
    throw new TypeError('options.customDirectories must be `string[]`');
  }
  if (
    options?.onlyCustomDirectories &&
    typeof options.onlyCustomDirectories !== 'boolean'
  ) {
    throw new TypeError('options.onlyCustomDirectories must be `boolean`');
  }

  // path to fullpath
  const fixedDirs =
    options?.customDirectories?.map((dir) => path.resolve(dir)) || [];
  const list = (
    await getSystemFonts({
      additionalFolders: fixedDirs,
      extensions: ['ttf', 'otf', 'ttc', 'woff', 'woff2', 'dfont'],
    })
  )
    .map((path) => {
      try {
        return FontDescriptor.createFromPath(path);
      } catch (error) {
        return;
      }
    })
    .reduce((acc: FontDescriptor[], val) => (val ? acc.concat(val) : acc), []); // this reduce means arr.flat()

  if (fixedDirs.length === 0 || !options?.onlyCustomDirectories) {
    return list;
  }

  // is file system case insnsitive
  const caseInsensitive =
    fs.existsSync(process.argv0) &&
    fs.existsSync(process.argv0.toLowerCase()) &&
    fs.existsSync(process.argv0.toUpperCase());
  // `getSystemFonts()` always catch system fonts
  // filter font in specified directories
  const dirRegExp = new RegExp(
    `^${fixedDirs
      ?.map((dir) => `(?:${dir.replace(/\\/g, '\\\\')})`)
      .join('|')}`,
    caseInsensitive ? 'i' : ''
  );
  return list.filter((fontDescriptor) => dirRegExp.exec(fontDescriptor.path));
};
