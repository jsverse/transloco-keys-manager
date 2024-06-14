import {
  assertTranslation,
  buildConfig,
  generateKeys,
  removeI18nFolder,
  sourceRoot,
  TranslationTestCase,
} from '../../build-translation-utils';
import { defaultValue, mockResolveProjectBasePath } from '../../../spec-utils';
import { Config } from '../../../../src/types';
import nodePath from 'node:path';

mockResolveProjectBasePath(sourceRoot);

/**
 * With ESM modules, you need to mock the modules beforehand (with jest.unstable_mockModule) and import them ashynchronously afterwards.
 * This thing is still in WIP at Jest, so keep an eye on it.
 * @see https://jestjs.io/docs/ecmascript-modules#module-mocking-in-esm
 */
const { buildTranslationFiles } = await import('../../../../src/keys-builder');

export function testMultiInputsConfig(fileFormat: Config['fileFormat']) {
  describe('Multi Inputs', () => {
    const type: TranslationTestCase = 'config-options/multi-input';
    const basePath = nodePath.join(type, 'src');
    const config = buildConfig(type, {
      fileFormat,
      input: [`${basePath}/folder-1`, `${basePath}/folder-2`],
    });

    beforeEach(() => removeI18nFolder(type));

    it('should work with multiple inputs', () => {
      let expected = generateKeys({ end: 39 });
      buildTranslationFiles(config);
      assertTranslation({ type, expected, fileFormat });
    });

    it('should work with scopes', () => {
      let expected = {
        '1': defaultValue,
        '2.1': defaultValue,
        '3.1': defaultValue,
        '4': defaultValue,
        '5': defaultValue,
      };

      buildTranslationFiles(config);
      assertTranslation({
        type,
        expected,
        path: 'admin-page/',
        fileFormat,
      });
    });
  });
}
