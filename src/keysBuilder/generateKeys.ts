import { getTranslationFilesPath } from '../keysDetective/getTranslationFilesPath';
import { readFile } from '../helpers/readFile';
import { writeFile } from '../helpers/writeFile';
import { mergeDeep } from '../helpers/mergeDeep';
import { ScopeMap } from '../types';

type Params = {
  translationPath: string;
  scopeToKeys: ScopeMap;
};

/**
 * In use in the Webpack Plugin
 */
export function generateKeys({ translationPath, scopeToKeys }: Params) {
  const currentFiles = getTranslationFilesPath(translationPath);
  if(!currentFiles) return;

  for(const filePath of currentFiles) {
    const { scope } = getScopeAndLangFromFullPath(filePath, translationPath);
    const keys = scope ? scopeToKeys[scope] : scopeToKeys.__global;

    if(!keys) continue;

    const translation = readFile(filePath, { parse: true });
    writeFile(filePath, mergeDeep({}, translation, keys));
  }
}

/**
 * /Users/username/www/folderName/src/assets/i18n/admin/es.json => { scope: admin, lang: es }
 * /Users/username/www/folderName/src/assets/i18n/es.json => { scope: undefined, lang: es }
 */
function getScopeAndLangFromFullPath(filePath: string, translationPath: string) {
  const [_, pathwithScope] = filePath.split(translationPath);

  const scopePath = pathwithScope.split('/');
  let scope, lang;
  if(scopePath.length > 1) {
    lang = scopePath.pop().replace('.json', '');
    scope = scopePath.join('/');
  } else {
    lang = scopePath[0].replace('.json', '');
  }

  return { scope, lang };
}
