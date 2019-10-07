const { mergeDeep } = require('./helpers');
const { initProcessParams, extractTemplateKeys, extractTSKeys } = require('./builder/public_api');
const { compareKeysToFiles } = require('./keys-detective');
const fs = require('fs');

let init = true;
let managerConfig;
let commonConfig;
class TranslocoPlugin {
  constructor(config) {
    if (config) {
      managerConfig = config;
    } else {
      managerConfig = fs.readFileSync(`${process.cwd()}/tkmConfig.json`, { encoding: 'UTF-8' }).toJSON();
    }
    commonConfig = initProcessParams({}, managerConfig);
  }

  apply(compiler) {
    compiler.hooks.watchRun.tapAsync('WatchRun', (comp, cb) => {
      if (init) {
        cb();
        init = false;
        return;
      }
      const keysExtractions = { html: [], ts: [] };
      const files = Object.keys(comp.watchFileSystem.watcher.mtimes);
      if (managerConfig.configPath) {
        const configChanged = files.some(file => file.includes(managerConfig.configPath));
        if (configChanged) {
          commonConfig = initProcessParams({}, managerConfig);
        }
      }
      for (const file of files) {
        let fileType;
        if (file.endsWith('.html')) {
          fileType = 'html';
        } else if (!file.endsWith('spec.ts') && file.endsWith('.ts')) {
          fileType = 'ts';
        }
        fileType ? keysExtractions[fileType].push(file) : keysExtractions;
      }
      if (keysExtractions.html.length || keysExtractions.ts.length) {
        Promise.all([
          extractTemplateKeys({ ...commonConfig, files: keysExtractions.html }),
          extractTSKeys({ ...commonConfig, files: keysExtractions.ts })
        ]).then(([htmlResult, tsResult]) => {
          const allKeys = mergeDeep({}, htmlResult.keys, tsResult.keys);
          const keysFound = Object.keys(allKeys).some(key => Object.keys(allKeys[key]).length > 0);
          // hold a file map and deep compare?
          keysFound &&
            compareKeysToFiles({ keys: allKeys, i18nPath: managerConfig.i18n, addMissing: true, prodMode: true });
          cb();
        });
      } else {
        cb();
      }
    });
  }
}
module.exports = { TranslocoPlugin };
