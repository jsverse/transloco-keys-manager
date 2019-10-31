#!/usr/bin/env node
import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';

import { optionDefinitions, sections } from './cliOptions';
import { buildTranslationFiles } from './keysBuilder';
import { findMissingKeys } from './keysDetective';

const mainDefinitions = [
  { name: 'command', defaultOption: true }
]

const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true })
const argv = mainOptions._unknown || []

const config = commandLineArgs(optionDefinitions, {
  camelCase: true,
  argv
});

const { help } = config;

if (help) {
  const usage = commandLineUsage(sections);
  // Don't delete, it's the help menu
  console.log(usage);
  process.exit();
}

if (mainOptions.command === 'extract') {
  buildTranslationFiles(config);
} else if (mainOptions.command === 'find') {
  findMissingKeys(config);
} else {
  console.log(`Please provide an action...`);
}
