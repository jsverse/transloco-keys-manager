/**
 * /Users/username/www/folderName/src/assets/i18n/admin/es.json => { scope: admin, lang: es }
 * /Users/username/www/folderName/src/assets/i18n/es.json => { scope: undefined, lang: es }
 */
import { toUnixFormat } from './toUnixFormat';

export function getScopeAndLangFromFullPath(filePath: string, translationPath: string) {
  filePath = toUnixFormat(filePath);
  translationPath = toUnixFormat(translationPath);

  if (translationPath.endsWith('/') === false) {
    translationPath = `${translationPath}/`;
  }

  const [_, pathwithScope] = filePath.split(translationPath);
  const scopePath = pathwithScope.split('/');

  let scope, lang;
  if (scopePath.length > 1) {
    lang = scopePath.pop().replace('.json', '');
    scope = scopePath.join('/');
  } else {
    lang = scopePath[0].replace('.json', '');
  }

  return { scope, lang };
}
