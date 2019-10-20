import { resolveConfig } from './helpers/resolveConfig';
import { extractTemplateKeys } from './keysBuilder/extractTemplateKeys';
import { extractTSKeys } from './keysBuilder/extractTSKeys';
import { mergeDeep } from './helpers/mergeDeep';
import { compareKeysToFiles } from './keysDetective/compareKeysToFiles';
import { Config, ExtractionResult } from './types';
import { initExtraction } from './keysBuilder/initExtraction';

let init = true;

export class TranslocoExtractKeysPlugin {
  config: Config;
  inlineConfig: Config;

  constructor(inlineConfig: Config) {
    this.config = resolveConfig(inlineConfig);
    this.inlineConfig = inlineConfig;
  }

  apply(compiler) {

    compiler.hooks.watchRun.tap('WatchRun', (comp) => {
      if(init) {
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

        fileType && keysExtractions[fileType].push(file);
      }

      let htmlResult: ExtractionResult = initExtraction();
      let tsResult: ExtractionResult = initExtraction();

      if(keysExtractions.html.length || keysExtractions.ts.length) {
        if(keysExtractions.html.length) {
          htmlResult = extractTemplateKeys({ ...this.config, files: keysExtractions.html });
        }

        if(keysExtractions.ts.length) {
          tsResult = extractTSKeys({ ...this.config, files: keysExtractions.ts });
        }

        const allKeys = mergeDeep({}, (htmlResult).scopeToKeys, tsResult.scopeToKeys);
        const hasTranslateKeys = Object.keys(allKeys).some(key => Object.keys(allKeys[key]).length > 0);

        if(hasTranslateKeys) {
          compareKeysToFiles({
            pluginMode: true,
            translationFiles: undefined,
            scopeToKeys: allKeys,
            translationPath: this.config.translationsPath,
            addMissingKeys: true
          });
        }
      }
    });
  }
}
