import { Config } from '../../src/types';
import fs from 'fs-extra';
import nodePath from 'node:path';
import { defaultValue } from '../spec-utils';

/**
 * With ESM modules, you need to mock the modules beforehand (with jest.unstable_mockModule) and import them ashynchronously afterwards.
 * This thing is still in WIP at Jest, so keep an eye on it.
 * @see https://jestjs.io/docs/ecmascript-modules#module-mocking-in-esm
 */
const { getCurrentTranslation } = await import(
  '../../src/keys-builder/utils/get-current-translation'
);

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
  | 'add-missing-keys'
  | 'comments';

export function buildConfig(
  type: TranslationTestCase,
  config: Partial<Config> = {},
) {
  return {
    input: [nodePath.join(type, 'src' + '')],
    output: nodePath.join(type, `i18n`),
    translationsPath: nodePath.join(type, `i18n`),
    langs: ['en', 'es', 'it'],
    defaultValue,
    ...config,
  } as Config;
}

interface assertTranslationParams extends Pick<Config, 'fileFormat'> {
  type: TranslationTestCase;
  expected: object;
  path?: string;
  root?: string;
}

export function assertTranslation({
  expected,
  ...rest
}: assertTranslationParams) {
  expect(loadTranslationFile(rest)).toEqual(expected);
}

export function assertPartialTranslation({
  expected,
  ...rest
}: assertTranslationParams) {
  expect(loadTranslationFile(rest)).toMatchObject(expected);
}

function loadTranslationFile({
  type,
  path,
  fileFormat,
  root = sourceRoot,
}: Omit<assertTranslationParams, 'expected'>) {
  return getCurrentTranslation({
    path: nodePath.join(root, type, 'i18n', `${path || ''}en.${fileFormat}`),
    fileFormat,
  });
}

export function removeI18nFolder(type: TranslationTestCase, root = sourceRoot) {
  fs.removeSync(nodePath.join(root, type, 'i18n'));
}
