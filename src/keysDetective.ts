#!/usr/bin/env node

import { messages } from './messages';
import { getLogger } from './helpers/logger';
import { resolveConfig } from './helpers/resolveConfig';
import { verifyTranslationsDir } from './keysDetective/verifyTranslationsDir';
import { compareKeysToFiles } from './keysDetective/compareKeysToFiles';
import { buildKeys } from './keysBuilder/buildKeys';
import { Config } from './types';

export async function findMissingKeys(inlineConfig: Config) {
  const logger = getLogger();
  const config = resolveConfig(inlineConfig);
  const translationFiles = verifyTranslationsDir(config.translationsPath);

  if(!translationFiles) return;

  logger.log('\n 🕵 🔎', `\x1b[4m${messages.startSearch}\x1b[0m`, '🔍 🕵\n');
  logger.startSpinner(`${messages.extract} `);

  const result = await buildKeys(config);
  logger.success(`${messages.extract} 🗝`);

  compareKeysToFiles({
    keys: result.keys,
    translationPath: `${process.cwd()}/${config.translationsPath}`,
    addMissingKeys: config.addMissingKeys,
    translationFiles
  });

}
