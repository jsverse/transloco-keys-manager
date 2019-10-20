import { resolveConfig } from './helpers/resolveConfig';
import { extractTemplateKeys } from './keysBuilder/extractTemplateKeys';
import { extractTSKeys } from './keysBuilder/extractTSKeys';
import { mergeDeep } from './helpers/mergeDeep';
import { compareKeysToFiles } from './keysDetective/compareKeysToFiles';
import { Config } from './types';

let init = true;

export class TranslocoExtractKeysPlugin {
  config: Config;
  inlineConfig: Config;

  constructor(inlineConfig: Config) {
    this.config = resolveConfig(inlineConfig);
    this.inlineConfig = inlineConfig;
  }

  apply(compiler) {
    compiler.hooks.watchRun.tapAsync('WatchRun', (comp, cb) => {
      if(init) {
        cb();
        init = false;
        return;
      }

      const keysExtractions = { html: [], ts: [] };
      const files = Object.keys(comp.watchFileSystem.watcher.mtimes);

      // Maybe someone added a TRANSLOCO_SCOPE
      const configChanged = files.some(file => file.includes('.module') || file.includes('.component'));

      if(configChanged) {
        // Rebuild the scopeMap
        this.config = resolveConfig(this.inlineConfig);
      }

      for(const file of files) {
        let fileType;
        if(file.endsWith('.html')) {
          fileType = 'html';
        } else if(!file.endsWith('spec.ts') && file.endsWith('.ts')) {
          fileType = 'ts';
        }

        fileType ? keysExtractions[fileType].push(file) : keysExtractions;
      }

      if(keysExtractions.html.length || keysExtractions.ts.length) {
        const [htmlResult, tsResult] = [
          extractTemplateKeys({ ...this.config, files: keysExtractions.html }),
          extractTSKeys({ ...this.config, files: keysExtractions.ts })
        ];

        const allKeys = mergeDeep({}, htmlResult.scopeToKeys, tsResult.scopeToKeys);
        const keysFound = Object.keys(allKeys).some(key => Object.keys(allKeys[key]).length > 0);

        // hold a file map and deep compare?
        keysFound &&
        compareKeysToFiles({
          translationFiles: undefined,
          scopeToKeys: allKeys,
          translationPath: this.config.translationsPath,
          addMissingKeys: true
        });
        cb();
      } else {
        cb();
      }
    });
  }
}
