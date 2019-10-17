import { readFile } from '../helpers/readFile';
import { mergeDeep } from '../helpers/mergeDeep';
import * as fs from 'fs';
import { messages } from '../messages';
import * as glob from 'glob';
import { getLogger } from '../helpers/logger';

export function mergeTranslationFiles({ outputPath, expectedFiles, keys, fileNameRgx }) {
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

    /** Read and write the merged json */
    const file = readFile(fileName);
    const merged = mergeDeep({}, scope ? keys[scope] : keys.__global, JSON.parse(file));
    fs.writeFileSync(fileName, JSON.stringify(merged, null, 2), { encoding: 'UTF-8' });
  }

  logger.success(`${messages.merged(currentFiles.length)} 🧙`);

  return expectedFiles;
}
