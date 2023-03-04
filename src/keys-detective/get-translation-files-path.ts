import glob from 'glob';

import { FileFormats } from '../types';

export function getTranslationFilesPath(
  path: string,
  fileFormat: FileFormats
): string[] {
  return glob.sync(`${path}/**/*.${fileFormat}`);
}
