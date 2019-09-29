#!/usr/bin/env node
const fs = require('fs');
const { buildTranslationFiles } = require('./keysBuilder');
const { findMissingKeys } = require('./keysDetective');
const { toCamelCase, mergeDeep } = require('./helpers');
const path = require('path');
const ACTIONS = { EXTRACT: '--extract', FIND_MISSING: '--find-missing' };
const [action, ...argv] = process.argv.slice(2);
const pkgDir = require('pkg-dir');

const argvMap = argv.reduce((acc, arg, i, arr) => {
  if (arg.includes('--')) {
    const key = toCamelCase(arg.replace('--', ''));
    const isFlag = arr[i + 1] === undefined || arr[i + 1].includes('--');
    acc[key] = isFlag ? true : arr[i + 1];
  }
  return acc;
}, {});
const basePath = path.resolve(process.cwd());
const pkgFile = pkgDir.sync();
const packageConfig = fs.readFileSync(`${pkgFile}/package.json`, { encoding: 'UTF-8' });
const cliConfig = mergeDeep({ extract: {}, find: {} }, JSON.parse(packageConfig)['transloco-keys-manager'] || {}, {
  [action.replace('--', '')]: argvMap
});
switch (action) {
  case ACTIONS.EXTRACT:
    buildTranslationFiles({ config: cliConfig.extract, basePath });
    break;
  case ACTIONS.FIND_MISSING:
    findMissingKeys({ config: cliConfig.find, basePath });
    break;
  default:
    console.log(`No action was passed... quiting`);
}
