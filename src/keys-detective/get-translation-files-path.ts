import * as glob from 'glob';
import { Format } from '../types';

export function getTranslationFilesPath(
  path: string,
  format: Format
): string[] {
  return glob.sync(`${path}/**/*.${format}`);
}
