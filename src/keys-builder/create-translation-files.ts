import { messages } from '../messages';
import { Config, DefaultLanguageValue, ScopeMap } from '../types';
import { getLogger } from '../utils/logger';
import { buildScopeFilePaths } from '../utils/path.utils';

import { buildTranslationFile, FileAction } from './build-translation-file';
import { runPrettier } from './utils/run-prettier';

export async function createTranslationFiles({
  scopeToKeys,
  defaults,
  langs,
  output,
  replace,
  removeExtraKeys,
  scopes,
  fileFormat,
  defaultLanguage,
  defaultOverrideExisting
}: Config & { scopeToKeys: ScopeMap, defaults: DefaultLanguageValue[] }) {
  const logger = getLogger();

  const scopeFiles = buildScopeFilePaths({
    aliasToScope: scopes.aliasToScope,
    langs,
    output,
    fileFormat,
  });
  const globalFiles = langs.map((lang) => ({
    path: `${output}/${lang}.${fileFormat}`,
    lang: lang
  }));
  const actions: FileAction[] = [];

  for (const { path, lang } of globalFiles) {
    actions.push(
      buildTranslationFile({
        path,
        translation: scopeToKeys.__global,
        replace,
        removeExtraKeys,
        fileFormat,
<<<<<<< HEAD
        defaults,
        isDefaultLanguage: lang == defaultLanguage,
        defaultOverrideExisting
      })
=======
      }),
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
    );
  }

  for (const { path, scope, lang } of scopeFiles) {
    actions.push(
      buildTranslationFile({
        path,
        translation: scopeToKeys[scope],
        replace,
        removeExtraKeys,
        fileFormat,
<<<<<<< HEAD
        defaults: defaults,
        isDefaultLanguage: lang == defaultLanguage,
        defaultOverrideExisting
      })
=======
      }),
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
    );
  }

  if (fileFormat === 'json') {
    await runPrettier(actions.map(({ path }) => path));
  }

  const newFiles = actions.filter((action) => action.type === 'new');

  if (newFiles.length) {
    logger.success(`${messages.creatingFiles} 🗂`);
    logger.log(newFiles.map((action) => action.path).join('\n'));
  }

  logger.log(`\n              🌵 ${messages.done} 🌵`);
}
