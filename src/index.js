#!/usr/bin/env node
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const { getConfig } = require('@ngneat/transloco-utils');

const { actionsDefinitions, optionDefinitions, sections } = require('./cli-options');

const { extract, findMissing, help } = commandLineArgs([...actionsDefinitions, ...optionDefinitions], {
  camelCase: true
});

if(help) {
  const usage = commandLineUsage(sections);
  // Don't delete, it's the help menu
  console.log(usage);
  return;
}

const config = getConfig();

if(Object.keys(config).length === 0) {
  console.log(`Missing transloco.config.js file`);
  return;
}

if(extract) {
  const { buildTranslationFiles } = require('./builder/public_api');
  buildTranslationFiles(config);
} else if(findMissing) {
  const { findMissingKeys } = require('./keys-detective');
  findMissingKeys(config);
} else {
  console.log(`Please provide an action...`);
}
