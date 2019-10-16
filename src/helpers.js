const ora = require('ora');
const fs = require('fs');
const glob = require('glob');

function isString(val) {
    return typeof val === 'string';
}

function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {[key]: {}});
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }

    return mergeDeep(target, ...sources);
}

function buildObjFromPath(path, value) {
    const obj = {};
    let current = obj;
    while (path.length > 1) {
        const [head, ...tail] = path;
        path = tail;
        if (!current[head]) {
            current[head] = {};
        }
        current = current[head];
    }
    const [last] = path;
    current[last] = value;
    return obj;
}

function sanitizeForRegex(str) {
    return str
        .split('')
        .map(char => (['$', '^', '/'].includes(char) ? `\\${char}` : char))
        .join('');
}

function toCamelCase(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
        .replace(/\s+|_|-|\//g, '');
}

function countKeysRecursively(obj) {
    return Object.keys(obj).reduce(
        (acc, curr) => (isObject(obj[curr]) ? acc + countKeysRecursively(obj[curr]) : ++acc),
        0
    );
}

function buildPathRecursively(obj) {
    return Object.keys(obj).reduce((acc, curr) => {
        const keys = isObject(obj[curr]) ? buildPathRecursively(obj[curr]).map(inner => `${curr}.${inner}`) : [curr];
        return acc.push(...keys) && acc;
    }, []);
}

function getPipeValue(str, value, char = '|') {
    if (isString(str)) {
        const splitted = str.split(char);
        const lastItem = splitted.pop();
        return lastItem === value ? [true, splitted.toString()] : [false, lastItem];
    }

    return [false, ''];
}

const defaultLogger = {
    log: (...msg) => console.log(...msg),
    succeed: msg => spinner.succeed(msg),
    startSpinner: msg => (spinner = ora().start(msg))
};
const noop = () => {
};
const prodModeLogger = {log: noop, startSpinner: noop, succeed: noop};

function getLogger(prodMode) {
    return prodMode ? prodModeLogger : defaultLogger;
}

function readFile(file) {
    return fs.readFileSync(file, {encoding: 'UTF-8'}).toString();
}

const defaultConfig = {
    src: 'src',
    langs: 'en',
    i18n: 'assets/i18n',
    addMissing: true
};

function buildScopesMap(src) {
    let scopeMap = {};
    const parse = (str) => {
      const sanitized = str.trim().replace(/'/g, '"').replace(/,\s*}/g, '}')
          .split(":").map((str) =>
               str.split(',')
                  .map((_str) => !_str.includes('"') ? _str.replace(/(\w.*)/, `"$1"`) : _str)
                  .join(',')
          ).join(':');
      return JSON.parse(sanitized);
    };
    const modulesMatch = `${process.cwd()}/${src}/**/*.module.ts`;
    const configModule = glob.sync(modulesMatch).find((module) => readFile(module).includes('TRANSLOCO_CONFIG'));
    if (configModule) {
      const scopeMapping = /scopeMapping[\s\r\t\n]*:[\s\r\t\n]*(?<scopes>{[^}]*})/.exec(readFile(configModule));
      if (scopeMapping) {
        scopeMap = parse(scopeMapping.groups.scopes);
      }
    }
    const tsFiles = glob.sync(`${process.cwd()}/${src}/**/*.ts`, {ignore: modulesMatch});
    const componentScopeRegex = /provide:\s*TRANSLOCO_SCOPE\s*,\s*useValue:(?=\s*{)\s*(?<value>{[^}]*})/;
    for (const file of tsFiles) {
      const content = readFile(file);
      const match = componentScopeRegex.exec(content);
      if (!match) continue;
      const {scope, alias} = parse(match.groups.value);
      scopeMap[scope] = alias;
    }
    let keysMap = Object.keys(scopeMap).reduce((acc, key) => {
        const mappedScope = toCamelCase(scopeMap[key]);
        acc[mappedScope] = key;
        return acc;
    }, {});

    return {keysMap, scopeMap};
}

function initParams(config) {
    const src = config.src || defaultConfig.src;
    const langs = config.langs || defaultConfig.langs;
    const replaceFiles = config.replaceFiles === undefined ? defaultConfig.replaceFiles : config.replaceFiles;
    const defaultValue = config.defaultValue;

    let i18n = config.i18n || defaultConfig.i18n;
    i18n = i18n.endsWith('/') ? i18n.slice(0, -1) : i18n;

    const scopes = buildScopesMap(src);
    const addMissing = config.addMissing === undefined ? defaultConfig.addMissing : config.addMissing;

    return {src, langs, defaultValue, i18n, scopes, replaceFiles, addMissing};
}

module.exports = {
    mergeDeep,
    buildObjFromPath,
    isObject,
    isString,
    sanitizeForRegex,
    toCamelCase,
    countKeysRecursively,
    buildPathRecursively,
    getLogger,
    getPipeValue,
    readFile,
    initParams,
    defaultConfig
};
