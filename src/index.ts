import getSystemFonts from 'get-system-fonts';
import { FontDescriptor } from './fontDescriptor';
import path from 'path';

export const getFontList = async (options?: {
  customDirectories?: string[];
  onlyCustomDirectories?: boolean;
}): Promise<FontDescriptor[]> => {
  // path to fullpath
  const fixedDirs = options?.customDirectories?.map((dir) => path.resolve(dir));
  const list = (
    await getSystemFonts({
      additionalFolders: fixedDirs || [],
      extensions: ['ttf', 'otf', 'ttc', 'woff', 'woff2', 'dfont'],
    })
  )
    .map((path) => FontDescriptor.createFromPath(path))
    .reduce((acc: FontDescriptor[], val) => acc.concat(val), []);

  if (!fixedDirs || fixedDirs.length === 0 || !options?.onlyCustomDirectories) {
    return list;
  }

  // `getSystemFonts()` always catch system fonts
  // filter font in specified directory if directories were specified
  const dirRegExp = new RegExp(
    `^${fixedDirs
      ?.map((dir) => `(?:${dir.replace(/\\/g, '\\\\')})`)
      .join('|')}`,
    'i'
  );
  return list.filter((fontDescriptor) => dirRegExp.exec(fontDescriptor.path));
};
