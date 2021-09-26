#!/usr/bin/env node
// import-conductor-skip
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

import { optionDefinitions, sections } from './cli-options';
import { buildTranslationFiles } from './keys-builder';
import { findMissingKeys } from './keys-detective';
import './polyfills';

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
config.command = mainOptions.command;
if (config.input) {
  config.input = config.input.split(',');
}
if (mainOptions.command === 'extract') {
  buildTranslationFiles(config);
} else if (mainOptions.command === 'find') {
  findMissingKeys(config);
} else {
  console.log(`Please provide an action...`);
}
