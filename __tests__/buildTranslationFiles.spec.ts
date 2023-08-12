// import-conductor-skip
import { Config, FileFormats, Translation } from '../src/types';

jest.mock('../src/utils/resolve-project-base-path');
import * as fs from 'fs-extra';

import { buildTranslationFiles } from '../src/keys-builder';
import { getCurrentTranslation } from '../src/keys-builder/utils/get-current-translation';
import { resetScopes } from '../src/keys-builder/utils/scope.utils';
import { messages } from '../src/messages';
import { resolveProjectBasePath } from '../src/utils/resolve-project-base-path';

const sourceRoot = '__tests__';

const defaultValue = 'missing';

function generateKeys({
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

function gConfig(
  type: TranslationCategory,
  config: Partial<Config> = {}
): Config {
  return {
    input: [`${type}`],
    output: `${type}/i18n`,
    langs: ['en', 'es', 'it'],
    defaultValue: defaultValue,
    ...config,
  };
}

type TranslationCategory =
  | 'pipe'
  | 'directive'
  | 'ngContainer'
  | 'ngTemplate'
  | 'read'
  | 'service'
  | 'marker'
  | 'inline-template'
  | 'unflat'
  | 'unflat-sort'
  | 'unflat-problematic-keys'
  | 'multi-input'
  | 'scope-mapping'
  | 'comments'
  | 'remove-extra-keys';

interface assertTranslationParams extends Pick<Config, 'fileFormat'> {
  type: TranslationCategory;
  expected: object;
  path?: string;
}

function assertTranslation({
  type,
  expected,
  path,
  fileFormat,
}: assertTranslationParams) {
  expect(loadTranslationFile(type, path, fileFormat)).toEqual(expected);
}

function assertPartialTranslation({
  type,
  expected,
  path,
  fileFormat,
}: assertTranslationParams) {
  expect(loadTranslationFile(type, path, fileFormat)).toMatchObject(expected);
}

function loadTranslationFile(
  type: TranslationCategory,
  path: string,
  fileFormat: FileFormats
) {
  return getCurrentTranslation({
    path: `./${sourceRoot}/${type}/i18n/${path || ''}en.${fileFormat}`,
    fileFormat,
  });
}

function removeI18nFolder(type: TranslationCategory) {
  fs.removeSync(`./${sourceRoot}/${type}/i18n`);
}

const formats: FileFormats[] = ['pot', 'json'];

describe.each(formats)('buildTranslationFiles in %s', (fileFormat) => {
  function createTranslations(config) {
    buildTranslationFiles({ ...config, fileFormat });
  }

  beforeAll(() => {
    (resolveProjectBasePath as any).mockImplementation(() => {
      return { projectBasePath: sourceRoot };
    });
  });

  // Reset to ensure the scopes are not being shared among the tests.
  afterEach(() => resetScopes());

  describe('Template Extraction', () => {
    describe('Pipe', () => {
      const type: TranslationCategory = 'pipe';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with pipe', () => {
        const expected = {
          ...generateKeys({ end: 48 }),
          '49.50.51.52': defaultValue,
          ...generateKeys({ start: 53, end: 62 }),
          '63.64.65': defaultValue,
          ...generateKeys({ start: 66, end: 78 }),
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

        createTranslations(config);
        assertTranslation({ type, expected, fileFormat });
      });
    });

    describe('Directive', () => {
      const type: TranslationCategory = 'directive';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with directive', () => {
        const expected = generateKeys({ end: 23 });
        ['Processing archive...', 'Restore Options'].forEach(
          (nonNumericKey) => {
            expected[nonNumericKey] = defaultValue;
          }
        );
        createTranslations(config);
        assertTranslation({ type, expected, fileFormat });
      });
    });

    describe('ngContainer', () => {
      const type: TranslationCategory = 'ngContainer';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with ngContainer', () => {
        let expected = generateKeys({ end: 46 });
        // See https://github.com/ngneat/transloco-keys-manager/issues/87
        expected["Bob's Burgers"] =
          expected['another(test)'] =
          expected['last "one"'] =
            defaultValue;
        createTranslations(config);
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

        createTranslations(config);
        assertTranslation({
          type,
          expected,
          path: 'admin-page/',
          fileFormat,
        });
      });
    });

    describe('ngTemplate', () => {
      const type: TranslationCategory = 'ngTemplate';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with ngTemplate', () => {
        let expected = generateKeys({ end: 41 });
        createTranslations(config);
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

        createTranslations(config);
        assertTranslation({
          type,
          expected,
          path: 'todos-page/',
          fileFormat,
        });
      });
    });

    describe('read', () => {
      const type: TranslationCategory = 'read';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with read', () => {
        const expected = {
          global: {
            ...generateKeys({ end: 3 }),
            ...generateKeys({
              end: 23,
              prefix: 'site-header.navigation.route',
            }),
            ...generateKeys({ end: 5, prefix: 'site-header.navigation' }),
            ...generateKeys({ end: 10, prefix: 'right-pane.actions' }),
            ...generateKeys({ end: 1, prefix: 'templates.translations' }),
            ...generateKeys({ end: 3, prefix: 'nested.translation' }),
            ...generateKeys({
              end: 3,
              prefix: 'some.other.nested.that-is-tested',
            }),
            ...generateKeys({ end: 12, prefix: 'ternary.nested' }),
            ...generateKeys({ end: 2, prefix: 'nested' }),
            ...generateKeys({
              end: 2,
              prefix: 'site-header.navigation.route.nested',
            }),
          },
          todos: {
            ...generateKeys({ end: 2, prefix: 'numbers' }),
          },
        };

        createTranslations(config);
        assertTranslation({ type, expected: expected.global, fileFormat });
        assertTranslation({
          type,
          expected: expected.todos,
          path: 'todos-page/',
          fileFormat,
        });
      });
    });
  });

  describe('Typescript Extraction', () => {
    describe('service', () => {
      const type: TranslationCategory = 'service';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with service', () => {
        const expected = {
          ...generateKeys({ end: 19 }),
          ...{ '20.21.22.23': defaultValue },
          ...generateKeys({ start: 24, end: 33 }),
          'inject.test': defaultValue,
        };

        createTranslations(config);
        assertTranslation({ type, expected, fileFormat });
      });

      it('should work with scopes', () => {
        const expected = {
          todos: {
            '1': defaultValue,
            '2.1': defaultValue,
          },
          admin: {
            '3.1': defaultValue,
            '4': defaultValue,
          },
          nested: {
            '5': defaultValue,
            '6.1': defaultValue,
          },
        };

        createTranslations(config);
        assertTranslation({
          type,
          expected: expected.todos,
          path: 'todos-page/',
          fileFormat,
        });
        assertTranslation({
          type,
          expected: expected.admin,
          path: 'admin-page/',
          fileFormat,
        });
        assertTranslation({
          type,
          expected: expected.nested,
          path: 'nested/scope/',
          fileFormat,
        });
      });

      it('should work when passing an array of keys', () => {
        const expected = generateKeys({ start: 26, end: 33 });

        createTranslations(config);
        assertPartialTranslation({ type, expected, fileFormat });
      });
    });

    describe('marker', () => {
      const type: TranslationCategory = 'marker';

      beforeEach(() => removeI18nFolder(type));

      it('should work with marker', () => {
        const config = gConfig(type);

        let expected = {};
        expected['username4'] = defaultValue;
        expected['password4'] = defaultValue;
        expected['username'] = defaultValue;
        expected['password'] = defaultValue;
        createTranslations(config);
        assertTranslation({ type, expected, fileFormat });
      });
    });

    describe('inline template', () => {
      const type: TranslationCategory = 'inline-template';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with inline templates', () => {
        const expected = generateKeys({ end: 23 });
        ['Processing archive...', 'Restore Options'].forEach(
          (nonNumericKey) => {
            expected[nonNumericKey] = defaultValue;
          }
        );
        createTranslations(config);
        assertTranslation({ type, expected, fileFormat });
      });
    });
  });

  describe('Config', () => {
    describe('unflat', () => {
      const type: TranslationCategory = 'unflat';
      const config = gConfig(type, { unflat: true });

      beforeEach(() => removeI18nFolder(type));

      it('should work with unflat true', () => {
        const expected = {
          global: {
            a: {
              '1': defaultValue,
            },
          },
        };
        createTranslations(config);
        assertTranslation({ type, expected: expected.global, fileFormat });
      });
    });

    describe('unflat-sort', () => {
      const type: TranslationCategory = 'unflat-sort';
      const config = gConfig(type, { unflat: true, sort: true });

      beforeEach(() => removeI18nFolder(type));

      it('should work with unflat and sort true', () => {
        const expected = {
          global: {
            b: {
              b: {
                a: defaultValue,
                b: defaultValue,
              },
              c: {
                a: defaultValue,
                p: defaultValue,
                x: defaultValue,
              },
            },
          },
        };
        createTranslations(config);
        assertTranslation({ type, expected: expected.global, fileFormat });
      });
    });

    describe('Unflat problematic keys', () => {
      const type: TranslationCategory = 'unflat-problematic-keys';
      const config = gConfig(type, { unflat: true });
      const spy = jest.spyOn(messages, 'problematicKeysForUnflat');

      beforeEach(() => removeI18nFolder(type));

      it('should work with unflat true and problematic keys', () => {
        const expected = {
          global: {
            a: defaultValue,
            b: defaultValue,
            c: defaultValue,
            d: {
              '1': defaultValue,
              '2': defaultValue,
            },
            e: {
              a: defaultValue,
              aa: defaultValue,
            },
            f: defaultValue,
          },
        };
        const expectedProblematicKeys = [
          'a',
          'a.b',
          'a.c',
          'b',
          'b.a',
          'b.b',
          'f',
          'f.a',
          'f.a.a',
          'f.a.b',
          'f.b',
          'f.b.a.a',
        ];
        createTranslations(config);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(expectedProblematicKeys);
        assertTranslation({ type, expected: expected.global, fileFormat });
      });

      afterEach(() => {
        spy.mockReset();
      });
    });

    describe('Multi Inputs', () => {
      const type: TranslationCategory = 'multi-input';
      const config = gConfig(type, {
        input: [`${type}/folder-1`, `${type}/folder-2`],
      });

      beforeEach(() => removeI18nFolder(type));

      it('should work with multiple inputs', () => {
        let expected = generateKeys({ end: 39 });
        createTranslations(config);
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

        createTranslations(config);
        assertTranslation({
          type,
          expected,
          path: 'admin-page/',
          fileFormat,
        });
      });
    });

    describe('Scope mapping', () => {
      const type: TranslationCategory = 'scope-mapping';
      const config = gConfig(type, {
        scopePathMap: {
          scope1: `./${sourceRoot}/${type}/i18n/scopes/mapped`,
        },
      });

      beforeEach(() => removeI18nFolder(type));

      it('should work with scope mapping', () => {
        let expected = generateKeys({ end: 3 });
        createTranslations(config);
        assertTranslation({
          type,
          path: 'scopes/mapped/',
          expected,
          fileFormat,
        });
      });
    });
  });

  describe('comments', () => {
    const type: TranslationCategory = 'comments';
    const config = gConfig(type);

    beforeEach(() => removeI18nFolder(type));

    it('should work with comments', () => {
      const expected = {
        global: {
          'a.some.key': defaultValue,
          'b.some.key': defaultValue,
          'c.some.key': defaultValue,
          'need.transloco': defaultValue,
          '1.some': defaultValue,
          ...generateKeys({ end: 8 }),
          '10': defaultValue,
          '13': defaultValue,
          '11.12': defaultValue,
          'hey.man': defaultValue,
          'whats.app': defaultValue,
          '101': defaultValue,
          '111.12': defaultValue,
          hello: defaultValue,
          'hey1.man': defaultValue,
          'whats1.app': defaultValue,
          hello1: defaultValue,
          '131': defaultValue,
          ...generateKeys({ end: 5, prefix: '10' }),
          '10.6.7': defaultValue,
          '11': defaultValue,
          '11.1': defaultValue,
          '11.2.3': defaultValue,
          '200': defaultValue,
          '201': defaultValue,
          '202': defaultValue,
          '203.204': defaultValue,
          '205': defaultValue,
          '206': defaultValue,
          '207.208': defaultValue,
          '209': defaultValue,
          '210': defaultValue,
          '211': defaultValue,
          '212': defaultValue,
          '213.214': defaultValue,
          '215': defaultValue,
          '216': defaultValue,
          '217.218': defaultValue,
          'from.comment': defaultValue,
          'pretty.cool.da': defaultValue,
          ...generateKeys({ end: 4, prefix: 'global' }),
          ...generateKeys({ end: 8, prefix: 'outer.read' }),
          ...generateKeys({ end: 4, prefix: 'inner.read' }),
          ...generateKeys({ end: 2, prefix: 'another.container' }),
        },
        admin: {
          '1': defaultValue,
          '2.3': defaultValue,
          '4': defaultValue,
          '5555': defaultValue,
        },
      };
      createTranslations(config);

      assertTranslation({ type, expected: expected.global, fileFormat });
      assertTranslation({
        type,
        expected: expected.admin,
        path: 'admin/',
        fileFormat,
      });
    });
  });

  describe('Remove extra keys', () => {
    const type = 'remove-extra-keys';
    const basePath = `./${sourceRoot}/${type}`;
    const withKeyTpl = `${basePath}/1-before.html.in`;
    const missingKeyTpl = `./${basePath}/1-after.html.in`;
    const testHtmlFile = `./${basePath}/1.html`;

    beforeEach(() => removeI18nFolder(type));

    afterEach(() => fs.unlinkSync(testHtmlFile));

    interface RemoveKeysOptions {
      baseConfig: Config;
      expected: {
        before: Translation;
        deleted: Translation;
        skipDeletion: Translation;
      };
    }
    function testRemoveExtraKeys({ baseConfig, expected }: RemoveKeysOptions) {
      it('should remove unused keys when remove-extra-keys is true', () => {
        fs.copyFileSync(withKeyTpl, testHtmlFile);
        createTranslations({ ...baseConfig, removeExtraKeys: false });
        assertTranslation({ type, expected: expected.before, fileFormat });

        fs.copyFileSync(missingKeyTpl, testHtmlFile);
        createTranslations({ ...baseConfig, removeExtraKeys: true });
        assertTranslation({ type, expected: expected.deleted, fileFormat });
      });

      it('should keep unused keys when remove-extra-keys is false', () => {
        fs.copyFileSync(withKeyTpl, testHtmlFile);
        createTranslations({ ...baseConfig, removeExtraKeys: false });
        assertTranslation({ type, expected: expected.before, fileFormat });

        fs.copyFileSync(missingKeyTpl, testHtmlFile);
        createTranslations({ ...baseConfig, removeExtraKeys: false });
        assertTranslation({
          type,
          expected: expected.skipDeletion,
          fileFormat,
        });
      });
    }

    // Run with unflat = true to test the nested JSON structure.
    describe('with unflat = true', () => {
      const expectedBefore = {
        '1': 'missing',
        '2': 'missing',
        group1: { '1': 'missing', '2': 'missing' },
        group2: { '1': 'missing', '2': 'missing' },
      };
      const expectedDeleted = {
        '2': 'missing',
        group1: { '2': 'missing' },
        group3: { '2': 'missing' },
      };
      const expectedNoDeletion = {
        ...expectedBefore,
        group3: { '2': 'missing' },
      };

      const baseConfig = gConfig(type, { unflat: true });
      testRemoveExtraKeys({
        baseConfig,
        expected: {
          before: expectedBefore,
          deleted: expectedDeleted,
          skipDeletion: expectedNoDeletion,
        },
      });
    });

    // Run with unflat = false to test the flattened JSON structure.
    describe('with unflat = false', () => {
      const expectedBefore = {
        '1': 'missing',
        '2': 'missing',
        'group1.1': 'missing',
        'group1.2': 'missing',
        'group2.1': 'missing',
        'group2.2': 'missing',
      };
      const expectedDeleted = {
        '2': 'missing',
        'group1.2': 'missing',
        'group3.2': 'missing',
      };
      const expectedNoDeletion = {
        ...expectedBefore,
        'group3.2': 'missing',
      };

      const baseConfig = gConfig(type, { unflat: false });
      testRemoveExtraKeys({
        baseConfig,
        expected: {
          before: expectedBefore,
          deleted: expectedDeleted,
          skipDeletion: expectedNoDeletion,
        },
      });
    });
  });
});
