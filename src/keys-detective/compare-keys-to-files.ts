import { getGlobalConfig } from '@ngneat/transloco-utils';
import { applyChange, diff } from 'deep-diff';
import { flatten } from 'flat';
import * as glob from 'glob';

import { messages } from '../messages';
import { ScopeMap } from '../types';
import { readFile, writeFile } from '../utils/file.utils';
import { getLogger } from '../utils/logger';
import { getScopeAndLangFromPath } from '../utils/path.utils';

import { buildTable } from './build-table';
import { getTranslationFilesPath } from './get-translation-files-path';
type Params = {
  scopeToKeys: ScopeMap;
  translationPath: string;
  addMissingKeys: boolean;
  emitErrorOnExtraKeys: boolean;
  outputFormat: 'json' | 'pot';
};

export function compareKeysToFiles({
  scopeToKeys,
  translationPath,
  addMissingKeys,
  emitErrorOnExtraKeys,
  outputFormat,
}: Params) {
  const logger = getLogger();
  logger.startSpinner(`${messages.checkMissing} ✨`);

  const diffsPerLang = {};

  /** An array of the existing translation files paths */
  const translationFiles = getTranslationFilesPath(
    translationPath,
    outputFormat
  );

  let result = [];
  const scopePaths = getGlobalConfig().scopePathMap || {};
  for (const [scope, path] of Object.entries(scopePaths)) {
    const keys = scopeToKeys[scope];
    if (keys) {
      result.push({
        keys,
        scope,
        translationPath: path,
        files: glob.sync(`${path}/*.${outputFormat}`),
      });
    }
  }
  const cache = {};

  for (const file of translationFiles) {
    const { scope = '__global' } = getScopeAndLangFromPath(
      file,
      translationPath,
      outputFormat
    );
    if (cache[scope]) {
      continue;
    }

    cache[scope] = true;
    const keys = scope ? scopeToKeys[scope] : scopeToKeys.__global;
    if (keys) {
      const isGlobal = scope === '__global';

      result.push({
        keys,
        scope,
        translationPath,
        files: glob.sync(
          `${translationPath}/${isGlobal ? '' : scope}/*.${outputFormat}`
        ),
      });
    }
  }

  for (const { files, keys, scope, translationPath } of result) {
    for (const filePath of files) {
      const { lang } = getScopeAndLangFromPath(
        filePath,
        translationPath,
        outputFormat
      );
      const translation = readFile(filePath, { parse: true });
      // We always build the keys flatten, so we need to make sure we compare to a flat file
      const flat = flatten<object, Record<string, string>>(translation, {
        safe: true,
      });
      // Compare the current file with the extracted keys
      const differences = diff(flat, keys);

      if (differences) {
        const langPath = `${scope !== '__global' ? scope + '/' : ''}${lang}`;

        diffsPerLang[langPath] = {
          missing: [],
          extra: [],
        };

        for (const diff of differences) {
          if (diff.kind === 'N') {
            diffsPerLang[langPath].missing.push(diff);
            addMissingKeys && applyChange(translation, keys, diff);
          } else if (diff.kind === 'D') {
            const isComment = diff.path.join('.').endsWith('.comment');
            !isComment && diffsPerLang[langPath].extra.push(diff);
          }
        }

        addMissingKeys && writeFile(filePath, translation);
      }
    }
  }

  logger.success(`${messages.checkMissing} ✨`);

  const langs = Object.keys(diffsPerLang).filter((lang) => {
    const { missing, extra } = diffsPerLang[lang];
    return missing.length || extra.length;
  });

  buildTable({
    langs,
    diffsPerLang,
    addMissingKeys,
    emitErrorOnExtraKeys,
  });
}
