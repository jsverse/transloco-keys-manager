import { buildTranslationFiles } from '../keys-builder';
import { buildTranslationFile } from '../keys-builder/build-translation-file';
import { extractTemplateKeys } from '../keys-builder/template';
import { extractTSKeys } from '../keys-builder/typescript';
import { Config } from '../types';
import { initExtraction } from '../utils/init-extraction';
import { mergeDeep } from '../utils/object.utils';
import { buildScopeFilePaths } from '../utils/path.utils';
import { resolveConfig } from '../utils/resolve-config';
import { updateScopesMap } from '../utils/update-scopes-map';

import { generateKeys } from './generate-keys';

let init = true;

export class TranslocoExtractKeysWebpackPlugin {
  config: Config;
  inlineConfig: Config;

  constructor(inlineConfig: Config = {}) {
    this.config = resolveConfig(inlineConfig);
    this.inlineConfig = inlineConfig;
  }

  apply(compiler) {
    compiler.hooks.watchRun.tap('TranslocoExtractKeysPlugin', (comp) => {
      if (init) {
        buildTranslationFiles(this.config);
        init = false;
        return;
      }

      const keysExtractions = { html: [], ts: [] };
      const files =
        comp.modifiedFiles || Object.keys(comp.watchFileSystem.watcher.mtimes);

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
            output: this.config.output,
            outputFormat: this.config.outputFormat,
          });

          paths.forEach(({ path }) =>
            buildTranslationFile({
              path,
              outputFormat: this.config.outputFormat,
            })
          );
          tsResult = extractTSKeys({
            ...this.config,
            files: keysExtractions.ts,
          });
        }

        if (keysExtractions.html.length) {
          htmlResult = extractTemplateKeys({
            ...this.config,
            files: keysExtractions.html,
          });
        }

        const scopeToKeys = mergeDeep(
          {},
          htmlResult.scopeToKeys,
          tsResult.scopeToKeys
        );
        const hasTranslateKeys = Object.keys(scopeToKeys).some(
          (key) => Object.keys(scopeToKeys[key]).length > 0
        );

        if (hasTranslateKeys) {
          generateKeys({
            config: this.config,
            translationPath: this.config.translationsPath,
            scopeToKeys,
          });
        }
      }
    });
  }
}
