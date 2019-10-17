import { getLogger } from '../helpers/logger';
import { verifyTranslationsDir } from './verifyTranslationsDir';
import { regexs } from '../regexs';
import { readFile } from '../helpers/readFile';
import * as fs from 'fs';
import chalk from 'chalk';
import { mapDiffToKeys } from './mapDiffToKeys';
import { messages } from '../messages';
import { DeepDiff, applyChange } from 'deep-diff';
import Table from 'cli-table';

export function compareKeysToFiles({ keys, translationPath, addMissingKeys, translationFiles }) {
  const logger = getLogger();
  logger.startSpinner(`${messages.checkMissing} ✨`);

  const result = {};
  /** An array of the existing translation files in the i18n dir */
  const currentFiles = translationFiles || verifyTranslationsDir(translationPath);
  if(!currentFiles) return;

  for(const fileName of currentFiles) {
    /** extract the lang name from the file */
    const { scope, fileLang } = regexs.fileLang(translationPath).exec(fileName).groups;
    const extracted = scope ? keys[scope] : keys.__global;

    if(!extracted) continue;

    /** Read the current file */
    const file = readFile(fileName);
    const fileObj = JSON.parse(file);
    const diffArr = DeepDiff(fileObj, extracted);

    if(diffArr) {
      const lang = `${scope ? scope + "/" : ''}${fileLang}`;
      result[lang] = {
        missing: [],
        extra: []
      };

      for(const diff of diffArr) {
        if(diff.kind === 'N') {
          result[lang].missing.push(diff);
          if(addMissingKeys) {
            applyChange(fileObj, extracted, diff);
          }
        } else if(diff.kind === 'D') {
          result[lang].extra.push(diff);
        }
      }

      if(addMissingKeys) {
        const json = JSON.stringify(fileObj, null, 2);
        /** Write the corrected object to the original file */
        fs.writeFileSync(fileName, json, 'utf8');
      }

    }
  }

  logger.success(`${messages.checkMissing} ✨`);

  const resultFiles = Object.keys(result).filter(rf => {
    const { missing, extra } = result[rf];
    return missing.length || extra.length;
  });

  if(resultFiles.length > 0) {
    logger.log();
    logger.success(`🏁 \x1b[4m${messages.summary}\x1b[0m 🏁`);

    const table = new Table({
      head: ['File Name', 'Missing Keys', 'Extra Keys'].map(h => chalk.cyan(h)),
      colWidths: [40, 40, 30]
    });

    for(let i = 0; i < resultFiles.length; i++) {
      const row = [];
      const { missing, extra } = result[resultFiles[i]];
      const hasMissing = missing.length > 0;
      const hasExtra = extra.length > 0;
      if(!(hasExtra || hasMissing)) continue;
      row.push(`${resultFiles[i]}`);
      if(hasMissing) {
        row.push(mapDiffToKeys(missing, 'rhs'));
      } else {
        row.push('--');
      }
      if(hasExtra) {
        row.push(mapDiffToKeys(extra, 'lhs'));
      } else {
        row.push('--');
      }
      table.push(row);
    }

    logger.log(table.toString());
    addMissingKeys && logger.success(`Added all missing keys to files 📜\n`);

  } else {
    logger.log(`\n🎉 ${messages.noMissing} 🎉\n`);
  }
}
