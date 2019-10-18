import { regexs } from '../regexs';
import * as fs from 'fs';
import { messages } from '../messages';
import { mergeTranslationFiles } from './mergeTranslationFiles';
import { createDirs } from './createDirs';
import { getLogger } from '../helpers/logger';
import { ScopeMap } from '../types';
import { writeFile } from '../helpers/writeFile';

type Params = {
  scopeToKeys: ScopeMap;
  langs: string[];
  outputPath: string;
  replace: boolean;
}

/** Create/Merge the translation files */
export function createFiles({ scopeToKeys, langs, outputPath, replace }: Params) {
  const logger = getLogger();

  // all scopes include __global
  const scopes = Object.keys(scopeToKeys);

  /** Build an array of the expected translation files (based on all the scopes and langs) */
  let expectedFiles: string[] = scopes.reduce((files, scope) => {
    langs.forEach(lang => {
      const path = scope === '__global' ? outputPath : `${outputPath}/${scope}`;
      files.push(`${path}/${lang}.json`);
    });

    return files;
  }, []);

  const fileNameRgx = regexs.fileLang(outputPath);

  if(replace) {
    for(const fileName of expectedFiles) {
      // delete the file
      fs.existsSync(fileName) && fs.unlinkSync(fileName);
    }
  } else {
    expectedFiles = mergeTranslationFiles({ outputPath, expectedFiles, scopeToKeys, fileNameRgx });
  }

  createDirs(outputPath, scopes);

  /** If there are items in the array, that means that we need to create missing translation files */
  if(expectedFiles.length) {
    logger.success(`${messages.creatingFiles} 🗂`);

    expectedFiles.forEach(fileName => {
      const { scope } = fileNameRgx.exec(fileName).groups;

      logger.log(`  - ${scope
        ? fileName.substring(fileName.indexOf(scope))
        : fileName.substring(fileName.lastIndexOf('/') + 1)}`
      );

      const scopeKey = scope || '__global';
      writeFile(fileName, scopeToKeys[scopeKey]);
    });
  }

  logger.log(`\n              🌵 ${messages.done} 🌵`);
}
