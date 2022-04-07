import * as glob from 'glob';

export function getTranslationFilesPath(
  path: string,
  outputFormat: 'json' | 'pot'
): string[] {
  return glob.sync(`${path}/**/*.${outputFormat}`);
}
