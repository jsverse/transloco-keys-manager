import * as glob from 'glob';

export function getTranslationFilesPath(path: string): string[] {
  return glob.sync(`${path}/**/*.json`);
}
