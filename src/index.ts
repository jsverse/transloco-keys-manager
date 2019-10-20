#!/usr/bin/env node
import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';

import { actionsDefinitions, optionDefinitions, sections } from './cliOptions';
import { buildTranslationFiles } from './keysBuilder';
import { findMissingKeys } from './keysDetective';

const config = commandLineArgs([...actionsDefinitions, ...optionDefinitions], {
  camelCase: true
});

const { extract, findMissing, help } = config;
console.log(config);

if (help) {
  const usage = commandLineUsage(sections);
  // Don't delete, it's the help menu
  console.log(usage);
  process.exit();
}

if (extract) {
  buildTranslationFiles(config);
} else if (findMissing) {
  findMissingKeys(config);
} else {
  console.log(`Please provide an action...`);
}
