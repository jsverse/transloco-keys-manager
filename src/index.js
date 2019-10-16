#!/usr/bin/env node
const fs = require('fs');
const {buildTranslationFiles} = require('./builder/public_api');
const {findMissingKeys} = require('./keys-detective');
const {toCamelCase, mergeDeep, readFile} = require('./helpers');
const path = require('path');

const argvMap = process.argv.slice(2).reduce((acc, arg, i, arr) => {
    if (arg.startsWith('--')) {
        const key = toCamelCase(arg.replace('--', ''));
        const nextArg = arr[i + 1];
        const isFlag = nextArg === undefined || nextArg.includes('--');
        acc[key] = isFlag || nextArg;
    }
    return acc;
}, {});
const basePath = path.resolve(process.cwd());
let config = mergeDeep({}, argvMap);
const configPath = `${basePath}/${argvMap.config || 'transloco.config.json'}`;
const tkmConfig = fs.existsSync(configPath)
    ? JSON.parse(readFile(configPath))
    : {};
config = mergeDeep(tkmConfig, config);
if (Object.keys(config).length === 0) {
    console.log(`No config found... quiting`);
    return;
}
if (argvMap['e'] || argvMap['extract']) {
    buildTranslationFiles(config);
} else if (argvMap['fm'] || argvMap['find-missing']) {
    findMissingKeys(config);
} else {
    console.log(`No action was passed... quiting`);
}