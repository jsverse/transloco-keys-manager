import nodePath from 'node:path';
import {
  BuildConfigOptions,
  defaultValue,
  buildConfig as _buildConfig,
  removeI18nFolder as _removeI18nFolder,
  assertPartialTranslation as _assertPartialTranslation,
  assertTranslation as _assertTranslation,
  AssertTranslationParams,
} from '../spec-utils';

export const sourceRoot = '__tests__/buildTranslationFiles';

export function generateKeys({
  start = 1,
  end,
  prefix,
}: {
  start?: number;
  end: number;
  prefix?: string;
}): { [index: string]: string } {
  const keys = {};
  for (let i = start; i <= end; i++) {
    keys[prefix ? `${prefix}.${i}` : i] = defaultValue;
  }
  return keys;
}

export type TranslationTestCase =
  | 'template-extraction/pipe'
  | 'template-extraction/directive'
  | 'template-extraction/ng-container'
  | 'template-extraction/ng-template'
  | 'template-extraction/control-flow'
  | 'template-extraction/prefix'
  | 'template-extraction/scope'
  | 'ts-extraction/service'
  | 'ts-extraction/pure-function'
  | 'ts-extraction/marker'
  | 'ts-extraction/inline-template'
  | 'config-options/unflat'
  | 'config-options/unflat-sort'
  | 'config-options/unflat-problematic-keys'
  | 'config-options/multi-input'
  | 'config-options/scope-mapping'
  | 'config-options/remove-extra-keys'
  | 'comments';

type WithTestCase<T> = T & { type: TranslationTestCase };

export function buildConfig(
  options: WithTestCase<Omit<BuildConfigOptions, 'sourceRoot'>>,
) {
  return _buildConfig({
    ...options,
    sourceRoot: nodePath.join(sourceRoot, options.type),
  });
}

type AssertParams = WithTestCase<Omit<AssertTranslationParams, 'root'>>;

export function assertTranslation({ type, ...params }: AssertParams) {
  _assertTranslation({
    ...params,
    root: nodePath.join(sourceRoot, type),
  });
}

export function assertPartialTranslation({ type, ...params }: AssertParams) {
  _assertPartialTranslation({
    ...params,
    root: nodePath.join(sourceRoot, type),
  });
}

export function removeI18nFolder(type: TranslationTestCase) {
  _removeI18nFolder(nodePath.join(sourceRoot, type));
}
