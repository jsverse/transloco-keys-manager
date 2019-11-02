import { getLogger } from '../helpers/logger';
import { getTranslationFilesPath } from './getTranslationFilesPath';
import { readFile } from '../helpers/readFile';
import { messages } from '../messages';
import { applyChange, DeepDiff } from 'deep-diff';
import { ScopeMap } from '../types';
import { writeFile } from '../helpers/writeFile';
import { buildTable } from './buildTable';
import { getScopeAndLangFromFullPath } from '../helpers/getScopeAndLangFromFullPath';

type Params = {
  scopeToKeys: ScopeMap;
  translationPath: string;
  addMissingKeys: boolean;
  translationFiles: string[];
};

export function compareKeysToFiles({ scopeToKeys, translationPath, addMissingKeys, translationFiles }: Params) {
  const logger = getLogger();
  logger.startSpinner(`${messages.checkMissing} ✨`);

  const diffsPerLang = {};

  /** An array of the existing translation files paths */
  const currentFiles = translationFiles || getTranslationFilesPath(translationPath);
  if (!currentFiles) return;

  for (const fileName of currentFiles) {
    /** extract the scope and the lang name from the file */
    const { scope, lang: fileLang } = getScopeAndLangFromFullPath(fileName, translationPath);
    const keys = scope ? scopeToKeys[scope] : scopeToKeys.__global;

    if (!keys) continue;

    const translation = readFile(fileName, { parse: true });

    // Compare the current file with the extracted keys
    const differences = DeepDiff(translation, keys);

    if (differences) {
      const lang = `${scope ? scope + '/' : ''}${fileLang}`;

      diffsPerLang[lang] = {
        missing: [],
        extra: []
      };

      for (const diff of differences) {
        if (diff.kind === 'N') {
          diffsPerLang[lang].missing.push(diff);
          addMissingKeys && applyChange(translation, keys, diff);
        } else if (diff.kind === 'D') {
          diffsPerLang[lang].extra.push(diff);
        }
      }

      addMissingKeys && writeFile(fileName, translation);
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
