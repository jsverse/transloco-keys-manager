import { getLogger } from '../helpers/logger';
import { getTranslationFilesPath } from './getTranslationFilesPath';
import { readFile } from '../helpers/readFile';
import { messages } from '../messages';
import { applyChange, DeepDiff } from 'deep-diff';
import { ScopeMap } from '../types';
import { writeFile } from '../helpers/writeFile';
import { buildTable } from './buildTable';
import { getScopeAndLangFromFullPath } from '../helpers/getScopeAndLangFromFullPath';
import { getConfig as translocoConfig } from '@ngneat/transloco-utils';
import * as glob from 'glob';
type Params = {
  scopeToKeys: ScopeMap;
  translationPath: string;
  addMissingKeys: boolean;
};

export function compareKeysToFiles({ scopeToKeys, translationPath, addMissingKeys }: Params) {
  const logger = getLogger();
  logger.startSpinner(`${messages.checkMissing} ✨`);

  const diffsPerLang = {};

  /** An array of the existing translation files paths */
  const translationFiles = getTranslationFilesPath(translationPath);

  if (!translationFiles.length) return;

  let result = [];
  const scopePaths = translocoConfig().scopePathMap || {};
  for (const [scope, path] of Object.entries(scopePaths)) {
    const keys = scopeToKeys[scope];
    if (keys) {
      result.push({
        keys,
        scope,
        translationPath: path,
        files: glob.sync(`${path}/*.json`)
      });
    }
  }

  for (const file of translationFiles) {
    const { scope } = getScopeAndLangFromFullPath(file, translationPath);
    const keys = scope ? scopeToKeys[scope] : scopeToKeys.__global;
    const isGlobal = scope === '__global';
    if (keys) {
      result.push({
        keys,
        scope,
        translationPath,
        files: glob.sync(`${translationPath}/${isGlobal ? '' : scope}/**/*.json`)
      });
    }
  }

  for (const { files, keys, scope, translationPath } of result) {
    for (const filePath of files) {
      const { lang } = getScopeAndLangFromFullPath(filePath, translationPath);
      const translation = readFile(filePath, { parse: true });

      // Compare the current file with the extracted keys
      const differences = DeepDiff(translation, keys);

      if (differences) {
        const langPath = `${scope ? scope + '/' : ''}${lang}`;

        diffsPerLang[langPath] = {
          missing: [],
          extra: []
        };

        for (const diff of differences) {
          if (diff.kind === 'N') {
            diffsPerLang[langPath].missing.push(diff);
            addMissingKeys && applyChange(translation, keys, diff);
          } else if (diff.kind === 'D') {
            diffsPerLang[langPath].extra.push(diff);
          }
        }

        addMissingKeys && writeFile(filePath, translation);
      }
    }
  }

  logger.success(`${messages.checkMissing} ✨`);

  const langs = Object.keys(diffsPerLang).filter(lang => {
    const { missing, extra } = diffsPerLang[lang];
    return missing.length || extra.length;
  });

  buildTable({
    langs,
    diffsPerLang,
    addMissingKeys
  });
}
