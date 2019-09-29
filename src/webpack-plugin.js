const { mergeDeep } = require('./helpers');
const { initProcessParams, extractTemplateKeys, extractTSKeys } = require('./keysBuilder');
const { compareKeysToFiles } = require('./keysDetective');
const pkgDir = require('pkg-dir');
const fs = require('fs');

let init = true;
let managerConfig;
let commonConfig;
class TranslocoPlugin {
  constructor(config) {
    if (config) {
      managerConfig = config;
    } else {
      const packageConfig = fs.readFileSync(`${pkgDir.sync()}/package.json`, { encoding: 'UTF-8' });
      managerConfig = JSON.parse(packageConfig)['transloco-keys-manager'];
    }
    commonConfig = initProcessParams({}, managerConfig.extract);
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
      if (managerConfig.extract.configPath) {
        const configChanged = files.some(file => file.includes(managerConfig.extract.configPath));
        if (configChanged) {
          commonConfig = initProcessParams({}, managerConfig.extract);
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
            compareKeysToFiles({ keys: allKeys, i18nPath: managerConfig.find.i18n, addMissing: true, prodMode: true });
          cb();
        });
      } else {
        cb();
      }
    });
  }
}
module.exports = TranslocoPlugin;
