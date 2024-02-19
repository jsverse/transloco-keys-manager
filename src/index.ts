#!/usr/bin/env node
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

import { optionDefinitions, sections } from './cli-options';
import { buildTranslationFiles } from './keys-builder';
import { findMissingKeys } from './keys-detective';
import { Config } from './types';

const mainDefinitions = [{ name: 'command', defaultOption: true }];

const mainOptions = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true,
});
const argv = mainOptions._unknown || [];

const config = commandLineArgs(optionDefinitions, {
  camelCase: true,
  argv,
});
const { help } = config;

if (help) {
  const usage = commandLineUsage(sections);
  // Don't delete, it's the help menu
  console.log(usage);
  process.exit();
}

const resolvedConfig = {
  ...config,
  command: mainOptions.command,
  input: config.input.split(','),
} as Config;

if (resolvedConfig.command === 'extract') {
  buildTranslationFiles(resolvedConfig);
} else if (resolvedConfig.command === 'find') {
  findMissingKeys(resolvedConfig);
} else {
  console.log(`Please provide an action...`);
}
