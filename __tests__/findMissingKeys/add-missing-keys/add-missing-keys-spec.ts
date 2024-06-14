import {
  assertTranslation,
  buildConfig,
  removeI18nFolder,
  TranslationTestCase,
} from '../../buildTranslationFiles/build-translation-utils';
import { defaultValue, mockResolveProjectBasePath } from '../../spec-utils';
import { Config } from '../../../src/types';
import nodePath from 'node:path';
import fs from 'fs-extra';
import { unflatten } from 'flat';

const sourceRoot = '__tests__/findMissingKeys';
mockResolveProjectBasePath(sourceRoot);

/**
 * With ESM modules, you need to mock the modules beforehand (with jest.unstable_mockModule) and import them ashynchronously afterwards.
 * This thing is still in WIP at Jest, so keep an eye on it.
 * @see https://jestjs.io/docs/ecmascript-modules#module-mocking-in-esm
 */
const { findMissingKeys } = await import('../../../src/keys-detective');

const missingJson = {
  '1': defaultValue,
  'a.b': defaultValue,
  '5': defaultValue,
};

const expectedJson = {
  ...missingJson,
  'c.d': defaultValue,
  '4': defaultValue,
};

export function testAddMissingKeysConfig(
  fileFormat: Config['fileFormat'] = 'json',
) {
  describe('Add Missing Keys', () => {
    const type: TranslationTestCase = 'add-missing-keys';
    const config = buildConfig(type, {
      fileFormat,
      addMissingKeys: true,
    });
    const translationPath = nodePath.join(sourceRoot, type, 'i18n', 'en.json');

    beforeEach(() => removeI18nFolder(type, sourceRoot));

    it('should add missing keys to translation', () => {
      fs.ensureFileSync(translationPath);
      fs.writeFileSync(translationPath, JSON.stringify(missingJson));
      findMissingKeys(config);
      assertTranslation({
        type,
        expected: expectedJson,
        fileFormat,
        root: sourceRoot,
      });
    });

    it('should respect unflat option', () => {
      fs.ensureFileSync(translationPath);
      fs.writeFileSync(translationPath, JSON.stringify(unflatten(missingJson)));
      findMissingKeys({ ...config, unflat: true });
      assertTranslation({
        type,
        expected: unflatten(expectedJson),
        fileFormat,
        root: sourceRoot,
      });
    });
  });
}
