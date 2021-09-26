import { setConfig } from '../config';
import { buildKeys } from '../keys-builder/build-keys';
import { messages } from '../messages';
import { Config } from '../types';
import { getLogger } from '../utils/logger';
import { resolveConfig } from '../utils/resolve-config';

import { compareKeysToFiles } from './compare-keys-to-files';
import { getTranslationFilesPath } from './get-translation-files-path';

export function findMissingKeys(inlineConfig: Config) {
  const logger = getLogger();
  const config = resolveConfig(inlineConfig);
  setConfig(config);

  const translationFiles = getTranslationFilesPath(config.translationsPath);

  if (translationFiles.length === 0) {
    console.log('No translation files found.');
    return;
  }

  logger.log('\n 🕵 🔎', `\x1b[4m${messages.startSearch}\x1b[0m`, '🔍 🕵\n');
  logger.startSpinner(`${messages.extract} `);

  const result = buildKeys(config);
  logger.success(`${messages.extract} 🗝`);

  compareKeysToFiles({
    scopeToKeys: result.scopeToKeys,
    translationPath: config.translationsPath,
    addMissingKeys: config.addMissingKeys,
    emitErrorOnExtraKeys: config.emitErrorOnExtraKeys,
  });
}
