#!/usr/bin/env node

import { messages } from './messages';
import { getLogger } from './helpers/logger';
import { resolveConfig } from './helpers/resolveConfig';
import { getTranslationFilesPath } from './keysDetective/getTranslationFilesPath';
import { compareKeysToFiles } from './keysDetective/compareKeysToFiles';
import { buildKeys } from './keysBuilder/buildKeys';
import { Config } from './types';
import { setConfig } from './config';

export function findMissingKeys(inlineConfig: Config) {
  const logger = getLogger();
  const config = resolveConfig(inlineConfig);
  setConfig(config);
  const translationFiles = getTranslationFilesPath(config.translationsPath);
  if (!translationFiles) return;

  logger.log('\n 🕵 🔎', `\x1b[4m${messages.startSearch}\x1b[0m`, '🔍 🕵\n');
  logger.startSpinner(`${messages.extract} `);

  const result = buildKeys(config);
  logger.success(`${messages.extract} 🗝`);

  compareKeysToFiles({
    scopeToKeys: result.scopeToKeys,
    translationPath: `${process.cwd()}/${config.translationsPath}`,
    addMissingKeys: config.addMissingKeys,
    translationFiles
  });
}
