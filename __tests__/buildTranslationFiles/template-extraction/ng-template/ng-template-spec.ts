import {
  assertTranslation,
  buildConfig,
  removeI18nFolder,
  sourceRoot,
  TranslationTestCase,
} from '../../build-translation-utils';
import {
  defaultValue,
  generateKeys,
  mockResolveProjectBasePath,
  paramsTestConfig,
} from '../../../spec-utils';
import { Config } from '../../../../src/types';
import { describe, beforeEach, it } from 'vitest';

mockResolveProjectBasePath(sourceRoot);

/**
 * With ESM modules, you need to mock the modules beforehand (with jest.unstable_mockModule) and import them ashynchronously afterwards.
 * This thing is still in WIP at Jest, so keep an eye on it.
 * @see https://jestjs.io/docs/ecmascript-modules#module-mocking-in-esm
 */
const { buildTranslationFiles } = await import('../../../../src/keys-builder');

export function testNgTemplateExtraction(fileFormat: Config['fileFormat']) {
  describe('ng-template', () => {
    const type: TranslationTestCase = 'template-extraction/ng-template';
    const config = buildConfig({ type, config: { fileFormat } });

    beforeEach(() => removeI18nFolder(type));

    it('should work with ngTemplate', () => {
      let expected = generateKeys({ end: 42 });
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
        path: 'todos-page/',
        fileFormat,
      });
    });

    it('should extract params', () => {
      const expected = {
        ...generateKeys({
          start: 2,
          end: 6,
          withParams: true,
        }),
        ...generateKeys({ start: 7, end: 8 }),
      };
      buildTranslationFiles(paramsTestConfig(config));
      assertTranslation({ type, expected, fileFormat });
    });
  });
}
