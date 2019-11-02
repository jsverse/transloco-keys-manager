/**
 * /Users/username/www/folderName/src/assets/i18n/admin/es.json => { scope: admin, lang: es }
 * /Users/username/www/folderName/src/assets/i18n/es.json => { scope: undefined, lang: es }
 */
export function getScopeAndLangFromFullPath(filePath: string, translationPath: string) {
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
