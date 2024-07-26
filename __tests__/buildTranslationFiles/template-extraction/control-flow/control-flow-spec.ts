import {
  assertTranslation,
  buildConfig,
  generateKeys,
  removeI18nFolder,
  sourceRoot,
  TranslationTestCase,
} from '../../build-translation-utils';
import { mockResolveProjectBasePath } from '../../../spec-utils';
import { Config } from '../../../../src/types';

mockResolveProjectBasePath(sourceRoot);

/**
 * With ESM modules, you need to mock the modules beforehand (with jest.unstable_mockModule) and import them ashynchronously afterwards.
 * This thing is still in WIP at Jest, so keep an eye on it.
 * @see https://jestjs.io/docs/ecmascript-modules#module-mocking-in-esm
 */
const { buildTranslationFiles } = await import('../../../../src/keys-builder');

export function testControlFlowExtraction(fileFormat: Config['fileFormat']) {
  describe('Control flow', () => {
    const type: TranslationTestCase = 'template-extraction/control-flow';
    const config = buildConfig({ type, config: { fileFormat } });

    beforeEach(() => removeI18nFolder(type));

    it('should work with control flow', () => {
      let expected = generateKeys({ end: 26 });
      buildTranslationFiles(config);
      assertTranslation({ type, expected, fileFormat });
    });
  });
}
