import { resolveConfig } from './helpers/resolveConfig';
import { extractTemplateKeys } from './keysBuilder/extractTemplateKeys';
import { extractTSKeys } from './keysBuilder/extractTSKeys';
import { mergeDeep } from './helpers/mergeDeep';
import { Config } from './types';
import { initExtraction } from './keysBuilder/initExtraction';
import { updateScopesMap } from './helpers/updateScopesMap';
import { buildTranslationFiles } from './keysBuilder';
import { buildTranslationFile } from './keysBuilder/buildTranslationFile';
import { resolveOutputPath } from './helpers/resolveOutputPath';
import { buildScopeFilePaths } from './helpers/buildScopeFilePaths';
import { generateKeys } from './keysBuilder/generateKeys';

let init = true;

export class TranslocoExtractKeysWebpackPlugin {
  config: Config;
  inlineConfig: Config;

  constructor(inlineConfig: Config) {
    this.config = resolveConfig(inlineConfig);
    this.inlineConfig = inlineConfig;
  }

  apply(compiler) {
    compiler.hooks.watchRun.tap('TranslocoExtractKeysPlugin', comp => {
      if (init) {
        buildTranslationFiles(this.config);
        init = false;
        return;
      }

      const keysExtractions = { html: [], ts: [] };
      const files = Object.keys(comp.watchFileSystem.watcher.mtimes);

      for (const file of files) {
        let fileType;
        if (file.endsWith('.html')) {
          fileType = 'html';
        } else if (!file.endsWith('spec.ts') && file.endsWith('.ts')) {
          fileType = 'ts';
        }

        fileType && keysExtractions[fileType].push(file);
      }

      let htmlResult = initExtraction();
      let tsResult = initExtraction();

      if (keysExtractions.html.length || keysExtractions.ts.length) {
        if (keysExtractions.ts.length) {
          // Maybe someone added a TRANSLOCO_SCOPE
          const newScopes = updateScopesMap({ files });

          const paths = buildScopeFilePaths({
            aliasToScope: newScopes,
            langs: this.config.langs,
            outputPath: resolveOutputPath(this.config.output)
          });

          paths.forEach(({ path }) => buildTranslationFile(path, {}));
          tsResult = extractTSKeys({ ...this.config, files: keysExtractions.ts });
        }

        if (keysExtractions.html.length) {
          htmlResult = extractTemplateKeys({ ...this.config, files: keysExtractions.html });
        }

        const scopeToKeys = mergeDeep({}, htmlResult.scopeToKeys, tsResult.scopeToKeys);
        const hasTranslateKeys = Object.keys(scopeToKeys).some(key => Object.keys(scopeToKeys[key]).length > 0);

        if (hasTranslateKeys) {
          generateKeys({
            config: this.config,
            translationPath: this.config.translationsPath,
            scopeToKeys
          });
        }
      }
    });
  }
}
