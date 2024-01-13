import glob, { IOptions as globOptions } from 'glob';

export function normalizedGlob(path: string, options: globOptions = {}) {
  // on windows system the path will have `\` which are used a escape characters in glob
  // therefore we have to escape those for the glob to work correctly on those systems
  const normalizedPath = path.replace(/\\/g, '/');
  const mergedOptions: globOptions = {
    ...options,
    ignore: ['node_modules/**', 'tmp/**', 'coverage/**', 'dist/**'],
  };

  return glob.sync(normalizedPath, mergedOptions);
}
