import { messages } from '../messages';
import { Config, Format, ScopeMap } from '../types';
import { getLogger } from '../utils/logger';
import { buildScopeFilePaths } from '../utils/path.utils';

import { buildTranslationFile, FileAction } from './build-translation-file';
import { runPrettier } from './utils/run-prettier';

export function createTranslationFiles({
  scopeToKeys,
  langs,
  output,
  replace,
  scopes,
  format,
}: Config & { scopeToKeys: ScopeMap }) {
  const logger = getLogger();

  const scopeFiles = buildScopeFilePaths({
    aliasToScope: scopes.aliasToScope,
    langs,
    output,
    format,
  });
  const globalFiles = langs.map((lang) => ({
    path: `${output}/${lang}.${format}`,
  }));
  const actions: FileAction[] = [];

  for (const { path } of globalFiles) {
    actions.push(
      buildTranslationFile(path, scopeToKeys.__global, replace, format)
    );
  }

  for (const { path, scope } of scopeFiles) {
    actions.push(
      buildTranslationFile(path, scopeToKeys[scope], replace, format)
    );
  }

  if (format === Format.Json) {
    runPrettier(actions.map(({ path }) => path));
  }

  const newFiles = actions.filter((action) => action.type === 'new');

  if (newFiles.length) {
    logger.success(`${messages.creatingFiles} 🗂`);
    logger.log(newFiles.map((action) => action.path).join('\n'));
  }

  logger.log(`\n              🌵 ${messages.done} 🌵`);
}
