import { utimesSync, writeFileSync } from 'node:fs';
import { relative, sep } from 'node:path';
import { templateExtractor } from '../keys-builder/template';
import { TSExtractor } from '../keys-builder/typescript';
import { Config, ScopeMap, FileType } from '../types';
import { initExtraction } from '../utils/init-extraction';
import { mergeDeep, stringify } from '../utils/object.utils';
import { resolveConfig } from '../utils/resolve-config';

import { generateKeys } from './generate-keys';
import { statSync } from 'fs';

export class TranslocoExtractKeysWebpackPlugin {
  config: Config;

  constructor(inlineConfig: Partial<Config> = {}) {
    this.config = resolveConfig(inlineConfig);
  }

  apply(compiler: any) {
    compiler.hooks.thisCompilation.tap(
      'TranslocoExtractKeysPlugin',
      (comp: any) => {
        comp.hooks.processAssets.tap(
          {
            name: 'TranslocoExtractKeysPlugin',
            stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          () => {
            let htmlResult = initExtraction();
            let tsResult = initExtraction();
            const files = compiler.modifiedFiles || comp.fileDependencies;

            for (const file of files) {
              if (
                !this.config.input.some((input) => file.startsWith(input + sep))
              ) {
                continue;
              }

              const fileType = resolveFileType(file);

              switch (fileType) {
                case 'html': {
                  htmlResult.scopeToKeys = templateExtractor({
                    defaultValue: this.config.defaultValue,
                    file,
                    scopes: this.config.scopes,
                    scopeToKeys: htmlResult.scopeToKeys,
                  });
                }
                case 'ts': {
                  tsResult.scopeToKeys = TSExtractor({
                    defaultValue: this.config.defaultValue,
                    file,
                    scopes: this.config.scopes,
                    scopeToKeys: tsResult.scopeToKeys,
                  });
                }
              }
            }

            const scopeToKeys = mergeDeep(
              {},
              htmlResult.scopeToKeys,
              tsResult.scopeToKeys,
            ) as ScopeMap;
            const hasTranslateKeys = Object.keys(scopeToKeys).some(
              (key) => Object.keys(scopeToKeys[key]).length > 0,
            );

            if (hasTranslateKeys) {
              const files = generateKeys({
                config: this.config,
                translationPath: this.config.translationsPath,
                scopeToKeys,
              });

              for (const { filePath, content } of files) {
                const data = stringify(content);
                const stats = statSync(filePath, { throwIfNoEntry: false });
                writeFileSync(filePath, data, { encoding: 'utf-8' });

                if (stats) {
                  utimesSync(filePath, stats.atime, stats.mtime);
                }

                for (const [name, info] of comp.assetsInfo) {
                  if (
                    info.sourceFilename &&
                    relative(info.sourceFilename, filePath) === ''
                  ) {
                    comp.updateAsset(
                      name,
                      new compiler.webpack.sources.RawSource(data),
                    );
                    break;
                  }
                }
              }
            }
          },
        );
      },
    );
  }
}

function resolveFileType(file: string): FileType | null {
  return isHtml(file) ? 'html' : isTs(file) ? 'ts' : null;
}

function isHtml(file: string) {
  return file.endsWith('.html');
}

function isTs(file: string) {
  return file.endsWith('.ts') && !file.endsWith('.spec.ts');
}
