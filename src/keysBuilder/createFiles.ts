import { regexs } from '../regexs';
import * as fs from 'fs';
import { messages } from '../messages';
import { mergeTranslationFiles } from './mergeTranslationFiles';
import { verifyOutputDir } from './verifyOutputDir';
import { getLogger } from '../helpers/logger';
import { createJson } from '../helpers/createJSON';

/** Create/Merge the translation files */
export function createFiles({ keys, langs, outputPath, replace }) {
  const logger = getLogger();

  const scopes = Object.keys(keys);
  const langArr = langs.map(l => l.trim());

  /** Build an array of the expected translation files (based on all the scopes and langs) */
  let expectedFiles = scopes.reduce((files, scope) => {
    langArr.forEach(lang => {
      const path = scope === '__global' ? outputPath : `${outputPath}/${scope}`;
      files.push(`${path}/${lang}.json`);
    });

    return files;
  }, []);

  const fileNameRgx = regexs.fileLang(outputPath);

  if(replace) {
    for(const fileName of expectedFiles) {
      fs.existsSync(fileName) && fs.unlinkSync(fileName);
    }
  } else {
    expectedFiles = mergeTranslationFiles({ outputPath, expectedFiles, keys, fileNameRgx });
  }

  verifyOutputDir(outputPath, scopes);

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
      const json = JSON.stringify(keys[scopeKey], null, 2);
      createJson(fileName, json);
    });
  }

  logger.log(`\n              🌵 ${messages.done} 🌵`);
}
