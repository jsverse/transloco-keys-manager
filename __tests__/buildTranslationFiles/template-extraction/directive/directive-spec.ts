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

mockResolveProjectBasePath(sourceRoot);

/**
 * With ESM modules, you need to mock the modules beforehand (with jest.unstable_mockModule) and import them ashynchronously afterwards.
 * This thing is still in WIP at Jest, so keep an eye on it.
 * @see https://jestjs.io/docs/ecmascript-modules#module-mocking-in-esm
 */
const { buildTranslationFiles } = await import('../../../../src/keys-builder');

export function testDirectiveExtraction(fileFormat: Config['fileFormat']) {
  describe('Directive', () => {
    const type: TranslationTestCase = 'template-extraction/directive';
    const config = buildConfig(type, { fileFormat });

    beforeEach(() => removeI18nFolder(type));

    it('should work with directive', () => {
      const expected = generateKeys({ end: 24 });
      ['Processing archive...', 'Restore Options'].forEach((nonNumericKey) => {
        expected[nonNumericKey] = defaultValue;
      });
      buildTranslationFiles(config);
      assertTranslation({ type, expected, fileFormat });
    });
  });
}
