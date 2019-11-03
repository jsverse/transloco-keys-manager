import { getTranslationFilesPath } from '../keysDetective/getTranslationFilesPath';
import { readFile } from '../helpers/readFile';
import { writeFile } from '../helpers/writeFile';
import { mergeDeep } from '../helpers/mergeDeep';
import { ScopeMap } from '../types';
import { getScopeAndLangFromFullPath } from '../helpers/getScopeAndLangFromFullPath';

type Params = {
  translationPath: string;
  scopeToKeys: ScopeMap;
};

/**
 * In use in the Webpack Plugin
 */
export function generateKeys({ translationPath, scopeToKeys }: Params) {
  const currentFiles = getTranslationFilesPath(translationPath);
  if (!currentFiles) return;

  for (const filePath of currentFiles) {
    const { scope } = getScopeAndLangFromFullPath(filePath, translationPath);
    const keys = scope ? scopeToKeys[scope] : scopeToKeys.__global;

    if (!keys) continue;

    const translation = readFile(filePath, { parse: true });
    writeFile(filePath, mergeDeep({}, translation, keys));
  }
}
