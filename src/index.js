#!/usr/bin/env node
const fs = require('fs');
const { buildTranslationFiles } = require('./builder/public_api');
const { findMissingKeys } = require('./keys-detective');
const { toCamelCase, mergeDeep, readFile } = require('./helpers');
const path = require('path');

const argvMap = process.argv.slice(2).reduce((acc, arg, i, arr) => {
  if (arg.startsWith('--')) {
    const key = toCamelCase(arg.replace('--', ''));
    const isFlag = arr[i + 1] === undefined || arr[i + 1].includes('--');
    acc[key] = isFlag ? true : arr[i + 1];
  }
  return acc;
}, {});
const basePath = path.resolve(process.cwd());
let config = mergeDeep({},  argvMap);
if (!argvMap.interactive && !argvMap.i) {
  const configPath = `${basePath}/${argvMap.config || 'transloco.json'}`;
  const tkmConfig = fs.existsSync(configPath)
      ? JSON.parse(readFile(configPath))
      : {};
  config = mergeDeep(tkmConfig, config);
  if (Object.keys(config).length === 0) {
    console.log(`No config found... quiting`);
    return;
  }
}
const options = { config, basePath };
if (argvMap['e'] || argvMap['extract']) {
  buildTranslationFiles(options);
} else if (argvMap['fm'] || argvMap['find-missing']) {
  findMissingKeys(options);
} else {
  console.log(`No action was passed... quiting`);
}