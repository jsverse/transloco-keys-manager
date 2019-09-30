#!/usr/bin/env node
const fs = require('fs');
const promptDirectory = require('inquirer-directory');
const inquirerFileTreeSelection = require('inquirer-file-tree-selection-prompt');
const inquirer = require('inquirer');
const find = require('find');
const glob = require('glob');
const [localLang] = require('os-locale')
  .sync()
  .split('-');
const messages = require('./messages').getMessages(localLang);
const { mergeDeep, buildObjFromPath, isObject, toCamelCase, countKeysRecursively, getLogger, getPipeValue, readFile } = require('./helpers');
const { regexs } = require('./regexs');

/** ENUMS */
const TEMPLATE_TYPE = { STRUCTURAL: 0, NG_TEMPLATE: 1 };

inquirer.registerPrompt('directory', promptDirectory);
inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

const queries = basePath => [
  {
    type: 'directory',
    name: 'src',
    message: messages.src,
    basePath
  },
  {
    type: 'directory',
    name: 'i18n',
    message: messages.output,
    basePath
  },
  {
    type: 'confirm',
    default: false,
    name: 'hasScope',
    message: messages.hasScope
  },
  {
    type: 'file-tree-selection',
    name: 'configPath',
    messages: messages.config,
    when: ({ hasScope }) => hasScope
  },
  {
    type: 'input',
    default: `en${localLang !== 'en' ? ', ' + localLang : ''}`,
    name: 'langs',
    message: messages.langs
  },
  {
    type: 'input',
    name: 'keepFlat',
    message: messages.keepFlat
  },
  {
    type: 'input',
    name: 'defaultValue',
    default: '""',
    message: messages.defaultValue
  }
];
const defaultConfig = {
  src: 'src',
  output: 'assets/i18n',
  langs: 'en'
};
let logger;

/** Get the keys from an ngTemplate based html code. */
function getTemplateBasedKeys(rgxResult, templateType) {
  let scopeKeys = [], read, readSearch, varName;
  const [matchedStr] = rgxResult;
  if (templateType === TEMPLATE_TYPE.STRUCTURAL) {
    varName = rgxResult.groups.varName;
    readSearch = matchedStr.match(/read:\s*(?:'|")(?<read>[a-zA-Z-0-9-_]*)(?:'|")/);
  } else {
    varName = matchedStr.match(/let-(?<varName>\w*)/).groups.varName;
    readSearch = matchedStr.match(/(?:\[?read\]?=\s*(?:'|"){1,2}(?<read>[a-zA-Z-0-9-_]*)(?:'|"){1,2})/);
  }
  const keyRegex = regexs.templateKey(varName);
  let keySearch = keyRegex.exec(matchedStr);
  while (keySearch) {
    scopeKeys.push(keySearch.groups.key);
    keySearch = keyRegex.exec(matchedStr);
  }
  read = readSearch && readSearch.groups.read;
  return { scopeKeys, read, varName };
}

/** Init the values needed for extraction */
function initExtraction(src) {
  return { srcPath: `${process.cwd()}/${src}`, keys: { __global: {} }, fileCount: 0 };
}
function performTSExtraction({ file, scopes, defaultValue, keepFlat, keys }) {
  const str = readFile(file);
  if (!str.includes('@ngneat/transloco')) return keys;
  const service = regexs.serviceInjection.exec(str);
  if (service) {
    /** service translationCalls regex */
    const rgx = regexs.translationCalls(service.groups.serviceName);
    keys = iterateRegex({ rgx, keys, str, keepFlat, scopes, defaultValue });
  } else {
    const directTranslate = regexs.directImport.exec(str);
    if (directTranslate) {
      const rgx = regexs.translationCalls();
      keys = iterateRegex({ rgx, keys, str, keepFlat, scopes, defaultValue });
    }
  }

  return keys;
}

/**
 * Extract all the keys that exists in the ts files. (no dynamic)
 */
function extractTSKeys({ src, keepFlat = [], scopes, defaultValue, files }) {
  let { srcPath, keys, fileCount } = initExtraction(src);
  return new Promise(resolve => {
    if (files) {
      for (const file of files) {
        fileCount++;
        keys = performTSExtraction({ file, defaultValue, keepFlat, scopes, keys });
      }
      resolve({ keys, fileCount });
    } else {
      find
        .eachfile(/\.ts$/, srcPath, file => {
          /** Filter out spec files */
          if (file.endsWith('.spec.ts')) return;
          fileCount++;
          keys = performTSExtraction({ file, defaultValue, keepFlat, scopes, keys });
        })
        .end(() => {
          resolve({ keys, fileCount });
        });
    }
  });
}

/**
 * Insert a given key to the right place in the keys map.
 * 1. If this is a scoped key, enter to the correct scope.
 * 2. If this is a global key, enter to the reserved '__global' key in the map.
 */
function insertValueToKeys({ inner, keys, scopes, key, defaultValue }) {
  const keyValue = defaultValue || `${messages.missingValue} '${inner.length ? `${key}.${inner.join('.')}` : key}'`;
  const value = inner.length ? buildObjFromPath(inner, keyValue) : defaultValue || keyValue;
  const scope = scopes.keysMap[key];
  if (scope) {
    if (!keys[scope]) {
      keys[scope] = {};
    }
    keys[scope] = keys[scope] && isObject(value) ? mergeDeep(keys[scope], value) : value;
  } else {
    keys.__global[key] = keys.__global[key] && isObject(value) ? mergeDeep(keys.__global[key], value) : value;
  }
}

function performTemplateExtraction({ file, scopes, defaultValue, keepFlat, keys }) {
  const str = readFile(file);
  if (!str.includes('transloco')) return keys;
  let result;
  /** structural directive and ng-template */
  [regexs.structural, regexs.template].forEach((rgx, index) => {
    result = rgx.exec(str);
    while (result) {
      const { scopeKeys, read, varName } = getTemplateBasedKeys(result, index);
      scopeKeys &&
        scopeKeys.forEach(rawKey => {
          /** The raw key may contain square braces we need to align it to '.' */
          let [key, ...inner] = rawKey
            .trim()
            .replace(/\[/g, '.')
            .replace(/'|"|\]/g, '')
            .replace(`${varName}.`, '')
            .split('.');
          /** Set the read as the first key */
          if (read) {
            inner.unshift(key);
            key = read;
          }
          insertValueToKeys({ inner, scopes, keys, key, defaultValue });
        });
      result = rgx.exec(str);
    }
  });
  /** directive & pipe */
  [regexs.directive, regexs.directiveTernary, regexs.pipe].forEach(rgx => {
    keys = iterateRegex({ rgx, keys, str, keepFlat, scopes, defaultValue });
  });

  return keys;
}

/**
 * Extract all the keys that exists in the template files.
 */
function extractTemplateKeys({ src, keepFlat = [], scopes, defaultValue, files }) {
  let { srcPath, keys, fileCount } = initExtraction(src);
  return new Promise(resolve => {
    if (files) {
      for (const file of files) {
        fileCount++;
        keys = performTemplateExtraction({ file, defaultValue, keepFlat, scopes, keys });
      }
      resolve({ keys, fileCount });
    } else {
      find
        .eachfile(/\.html$/, srcPath, file => {
          fileCount++;
          keys = performTemplateExtraction({ file, defaultValue, keepFlat, scopes, keys });
        })
        .end(() => {
          resolve({ keys, fileCount });
        });
    }
  });
}

function handleScope({scopeStr, key, inner, scopes}) {
  let scope;
  if (scopeStr.includes('|')) {
    const pipeValue = getPipeValue(scopeStr, 'scoped');
    if (pipeValue[0]) {
      scope = pipeValue[1];
    }
  } else if (scopeStr.includes('/')) {
    const splitted = scopeStr.split('/');
    splitted.pop();
    scope = splitted.join('/');
  }
  if (scope) {
    inner.unshift(key);
    key = scopes.scopeMap[scope];
  }

  return [key, inner];
}

/**
 * Iterates over a given regex until there a no results and adds all the keys found to the map.
 */
function iterateRegex({ rgx, keys, str, keepFlat, scopes, defaultValue }) {
  let result = rgx.exec(str);
  while (result) {
    /** support ternary operator */
    const {backtickKey, backtickScope, scope} = result.groups;
    const regexKeys = (result.groups.key || backtickKey).replace(/'|"|\s/g, '').split(':');
    for (const regexKey of regexKeys) {
      let [key, ...inner] = regexKey.split('.');
      if (keepFlat.includes(key)) {
        keys[regexKey] = defaultValue;
      } else {
        const scopeStr = scope || backtickScope;
        if (scopeStr) {
          [key, inner] = handleScope({scopeStr, key, inner, scopes});
        }
        insertValueToKeys({ inner, scopes, keys, key, defaultValue });
      }
    }
    result = rgx.exec(str);
  }
  return keys;
}

/**
 * Creates a new translation json file.
 */
function createJson(outputPath, json) {
  fs.writeFileSync(outputPath, json, 'utf8');
}

/**
 * Verifies that the output dir (and sub-dirs) exists, if not create them.
 */
function verifyOutputDir(outputPath, folders) {
  const scopes = folders.filter(key => key !== '__global');
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  for (const scope of scopes) {
    if (!fs.existsSync(`${outputPath}/${scope}`)) {
      fs.mkdirSync(`${outputPath}/${scope}`, { recursive: true });
    }
  }
}

/** Create/Merge the translation files */
function createFiles({ keys, langs, outputPath }) {
  const scopes = Object.keys(keys);
  const langArr = langs.split(',').map(l => l.trim());
  /** Build an array of the expected translation files (based on all the scopes and langs) */
  let expectedFiles = scopes.reduce((files, scope) => {
    langArr.forEach(lang => {
      const path = scope === '__global' ? outputPath : `${outputPath}/${scope}`;
      files.push(`${path}/${lang}.json`);
    });
    return files;
  }, []);
  verifyOutputDir(outputPath, scopes);
  /** An array of the existing translation files in the output dir */
  const currentFiles = glob.sync(`${outputPath}/**/*.json`);
  const fileNameRgx = regexs.fileLang(outputPath);
  /** iterate over the json files and merge the keys */
  if (currentFiles.length) {
    for (const fileName of currentFiles) {
      /** extract the lang name from the file */
      const { scope } = fileNameRgx.exec(fileName).groups;
      /** remove this file from the expectedFiles array since the file already exists */
      expectedFiles = expectedFiles.filter(f => f !== fileName);
      /** Read and write the merged json */
      const file = readFile(fileName);
      const merged = mergeDeep({}, scope ? keys[scope] : keys.__global, JSON.parse(file));
      fs.writeFileSync(fileName, JSON.stringify(merged, null, 2), { encoding: 'UTF-8' });
    }
  }
  /** If there are items in the array, that means that we need to create missing translation files */
  if (expectedFiles.length) {
    logger.succeed(`${messages.creatingFiles} 🗂`);
    expectedFiles.forEach(fileName => {
      const { scope } = fileNameRgx.exec(fileName).groups;
      logger.log(`  - ${scope 
          ? fileName.substring(fileName.indexOf(scope)) 
          : fileName.substring(fileName.lastIndexOf('/') + 1)}`
      );
      const scopeKey = scope || '__global';
      const json = JSON.stringify(keys[scopeKey], null, 2);
      createJson(fileName, json);
    });
  }
  if (currentFiles.length) {
    logger.succeed(`${messages.merged(currentFiles.length)} 🧙`);
  }
  logger.log(`\n              🌵 ${messages.done} 🌵`);
}

/** Build the keys object */
function buildKeys(options) {
  return Promise.all([extractTemplateKeys(options), extractTSKeys(options)]).then(([template, ts]) => {
    const keys = mergeDeep({}, template.keys, ts.keys);
    return Promise.resolve({ keys, fileCount: template.fileCount + ts.fileCount });
  });
}

/** Extract the scope mapping from the transloco config */
function getScopesMap(configPath) {
  if (!configPath) {
    return { keysMap: {}, scopeMap: {} };
  }
  const configFile = readFile(`${process.cwd()}/${configPath}`);
  const scopeMapping = /scopeMapping[\s\r\t\n]*:[\s\r\t\n]*(?<scopes>{[^}]*})/g.exec(configFile);
  let scopes = '{}';
  if (scopeMapping) {
    scopes = scopeMapping.groups.scopes;
  }
  const sanitized = scopes.trim().replace(/'/g, '"');
  const scopeMap = JSON.parse(`${sanitized}`);
  const keysMap = Object.keys(scopeMap).reduce((acc, key) => {
    const mappedScope = toCamelCase(scopeMap[key]);
    acc[mappedScope] = key;
    return acc;
  }, {});
  return { keysMap, scopeMap };
}

/** Merge cli input, argv and defaults */
function initProcessParams(input, config) {
  const src = input.src || config.src || defaultConfig.src;
  const langs = input.langs || config.langs || defaultConfig.langs;
  const defaultValue = input.defaultValue || config.defaultValue;
  let i18n = input.i18n || config.i18n || defaultConfig.i18n;
  i18n = i18n.endsWith('/') ? i18n.slice(0, -1) : i18n;
  const scopes = getScopesMap(input.configPath || config.configPath);
  let keepFlat = input.keepFlat || config.keepFlat;
  keepFlat = keepFlat ? keepFlat.split(',').map(l => l.trim()) : [];

  return { src, langs, defaultValue, i18n, scopes, keepFlat };
}

/** The main function, collects the settings and starts the files build. */
function buildTranslationFiles({ config, basePath }) {
  logger = getLogger(config.prodMode);
  return inquirer
    .prompt(config.interactive ? queries(basePath) : [])
    .then(input => {
      const { src, langs, defaultValue, i18n, scopes, keepFlat } = initProcessParams(input, config);
      logger.log('\x1b[4m%s\x1b[0m', `\n${messages.startBuild(langs.length)} 👷🏗\n`);
      logger.startSpinner(`${messages.extract} 🗝`);
      const options = { src, keepFlat, scopes, defaultValue };
      return buildKeys(options).then(({ keys, fileCount }) => {
        logger.succeed(`${messages.extract} 🗝`);
        /** Count all the keys found and reduce the scopes & global keys */
        const keysFound = countKeysRecursively(keys) - Object.keys(keys).length;
        logger.log('\x1b[34m%s\x1b[0m','ℹ', messages.keysFound(keysFound, fileCount));
        createFiles({ keys, langs, outputPath: `${process.cwd()}/${i18n}` });
      });
    })
    .catch(e => logger.log(e));
}

module.exports = {
  buildTranslationFiles,
  buildKeys,
  getScopesMap,
  initProcessParams,
  extractTemplateKeys,
  extractTSKeys
};
