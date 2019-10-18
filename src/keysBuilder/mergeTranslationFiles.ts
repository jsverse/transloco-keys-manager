import { readFile } from '../helpers/readFile';
import { mergeDeep } from '../helpers/mergeDeep';
import { messages } from '../messages';
import * as glob from 'glob';
import { getLogger } from '../helpers/logger';
import { ScopeMap } from '../types';
import { writeFile } from '../helpers/writeFile';

type Params = {
  outputPath: string;
  expectedFiles: string[];
  scopeToKeys: ScopeMap;
  fileNameRgx: RegExp;
}

export function mergeTranslationFiles({ outputPath, expectedFiles, scopeToKeys, fileNameRgx }: Params) {
  const logger = getLogger();
  /** An array of the existing translation files in the output dir */
  const currentFiles = glob.sync(`${outputPath}/**/*.json`);

  if(!currentFiles.length) return expectedFiles;

  /** iterate over the json files and merge the keys */
  for(const fileName of currentFiles) {
    /** extract the lang name from the file */
    const { scope } = fileNameRgx.exec(fileName).groups;

    /** remove this file from the expectedFiles array since the file already exists */
    expectedFiles = expectedFiles.filter(f => f !== fileName);

    /** Write the new keys with the existing file */
    const file = readFile(fileName);
    const merged = mergeDeep({}, scope ? scopeToKeys[scope] : scopeToKeys.__global, JSON.parse(file));
    writeFile(fileName, merged);
  }

  logger.success(`${messages.merged(currentFiles.length)} 🧙`);

  return expectedFiles;
}
