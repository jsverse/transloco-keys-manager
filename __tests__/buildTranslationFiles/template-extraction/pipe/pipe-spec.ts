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

export function testPipeExtraction(fileFormat: Config['fileFormat']) {
  describe('Pipe', () => {
    const type: TranslationTestCase = 'template-extraction/pipe';
    const config = buildConfig(type, { fileFormat });

    beforeEach(() => removeI18nFolder(type));

    it('should work with pipe', () => {
      const expected = {
        ...generateKeys({ end: 48 }),
        '49.50.51.52': defaultValue,
        ...generateKeys({ start: 53, end: 62 }),
        '63.64.65': defaultValue,
        ...generateKeys({ start: 66, end: 79 }),
        '{{count}} items': defaultValue,
      };
      [
        'Restore Options',
        'Processing archive...',
        'admin.1',
        'admin.2',
        'admin.3',
      ].forEach((nonNumericKey) => {
        expected[nonNumericKey] = defaultValue;
      });

      buildTranslationFiles(config);
      assertTranslation({ type, expected, fileFormat });
    });
  });
}
