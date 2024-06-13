import {
  assertTranslation,
  buildConfig,
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

export function testMarkerExtraction(fileFormat: Config['fileFormat']) {
  describe('marker', () => {
    const type: TranslationTestCase = 'ts-extraction/marker';

    beforeEach(() => removeI18nFolder(type));

    it('should work with marker', () => {
      const config = buildConfig(type, { fileFormat });

      const expected = {
        username4: defaultValue,
        password4: defaultValue,
        username: defaultValue,
        password: defaultValue,
      };
      buildTranslationFiles(config);
      assertTranslation({ type, expected, fileFormat });
    });
  });
}
