import getSystemFonts from 'get-system-fonts';
import recursiveWalk from 'get-system-fonts/dist/recursiveWalk';
import { FontDescriptor } from './fontDescriptor';
import path from 'path';
import fs from 'fs';

const FONTKIT_AVAILABLE_FONT_EXTENSIONS = [
  'ttf',
  'otf',
  'ttc',
  'woff',
  'woff2',
  'dfont',
];

export const getDescriptorFromPaths = (
  fontPaths: string[]
): Promise<FontDescriptor[]> =>
  new Promise((resolve, reject) => {
    try {
      const fontDescriptors = fontPaths
        .map((fontPath) => {
          try {
            return FontDescriptor.createFromPath(fontPath);
          } catch (error) {
            return;
          }
        })
        .reduce(
          (acc: FontDescriptor[], val) => (val ? acc.concat(val) : acc),
          []
        );
      resolve(fontDescriptors);
    } catch (error) {
      reject(error);
    }
  });

/**
 * Search fonts in directory.
 * @param {string} dirPath Directory path to search for fonts.
 */
export const getDirectoryFonts = async (
  dirPath: string
): Promise<FontDescriptor[]> => {
  if (typeof dirPath !== 'string') {
    throw new TypeError('dirPath must be `string`');
  }

  const fontPaths = await recursiveWalk(
    [dirPath],
    FONTKIT_AVAILABLE_FONT_EXTENSIONS
  );
  return getDescriptorFromPaths(fontPaths);
};

/**
 * Search fonts in directories.
 * @param {string[]} dirPaths Diresctories path to search for fonts.
 */
export const getDirectoriesFonts = async (
  dirPaths: string[]
): Promise<FontDescriptor[]> => {
  if (
    !Array.isArray(dirPaths) ||
    dirPaths.map((path) => typeof path !== 'string').includes(true)
  ) {
    throw new TypeError('dirPaths must be `string[]`');
  }

  return Promise.all(
    dirPaths.map((dirPath) => getDirectoryFonts(dirPath))
  ).then((dirFdList) =>
    dirFdList.reduce((acc: FontDescriptor[], val) => acc.concat(val), [])
  );
};

/**
 * Search installed fonts.
 */
export const getInstalledFonts = async (): Promise<FontDescriptor[]> => {
  const fontPaths = await getSystemFonts({
    extensions: FONTKIT_AVAILABLE_FONT_EXTENSIONS,
  });
  return getDescriptorFromPaths(fontPaths);
};

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

  if (options?.onlyCustomDirectories) {
    return getDirectoriesFonts(options?.customDirectories || []);
  }

  const fontPaths = await getSystemFonts({
    additionalFolders: options?.customDirectories || [],
    extensions: FONTKIT_AVAILABLE_FONT_EXTENSIONS,
  });
  return getDescriptorFromPaths(fontPaths);
};
