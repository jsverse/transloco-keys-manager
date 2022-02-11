// import-conductor-skip
jest.mock('../src/utils/resolve-project-base-path');
import * as fs from 'fs-extra';

import { buildTranslationFiles } from '../src/keys-builder';
import { getCurrentTranslation } from '../src/keys-builder/utils/get-current-translation';
import { messages } from '../src/messages';
import { Format } from '../src/types';
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

function gConfig(type: TranslationCategory, config = {}) {
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
  | 'comments';

interface assertTranslationParams {
  type: TranslationCategory;
  expected: object;
  format: Format;
  path?: string;
}

function assertTranslation({
  type,
  expected,
  path,
  format,
}: assertTranslationParams) {
  expect(loadTranslationFile(type, path, format)).toEqual(expected);
}

function assertPartialTranslation({
  type,
  expected,
  path,
  format,
}: assertTranslationParams) {
  expect(loadTranslationFile(type, path, format)).toMatchObject(expected);
}

function loadTranslationFile(
  type: TranslationCategory,
  path: string,
  format: Format
) {
  return getCurrentTranslation(
    `./${sourceRoot}/${type}/i18n/${path || ''}en.${format}`,
    format
  );
}

function removeI18nFolder(type: TranslationCategory) {
  fs.removeSync(`./${sourceRoot}/${type}/i18n`);
}

describe('buildTranslationFiles', () => {
  const formats = [[Format.Json], [Format.Pot]];

  beforeAll(() => {
    (resolveProjectBasePath as any).mockImplementation(() => {
      return { projectBasePath: sourceRoot };
    });
  });

  describe('Template Extraction', () => {
    describe('Pipe', () => {
      const type: TranslationCategory = 'pipe';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      test.each(formats)('should work with pipe in %s format', (format) => {
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

        buildTranslationFiles({ ...config, format });
        assertTranslation({ type, expected, format });
      });
    });

    describe('Directive', () => {
      const type: TranslationCategory = 'directive';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      test.each(formats)(
        'should work with directive in %s format',
        (format) => {
          const expected = generateKeys({ end: 23 });
          ['Processing archive...', 'Restore Options'].forEach(
            (nonNumericKey) => {
              expected[nonNumericKey] = defaultValue;
            }
          );
          buildTranslationFiles({ ...config, format });
          assertTranslation({ type, expected, format });
        }
      );
    });

    describe('ngContainer', () => {
      const type: TranslationCategory = 'ngContainer';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      test.each(formats)(
        'should work with ngContainer in %s format',
        (format) => {
          let expected = generateKeys({ end: 46 });
          // See https://github.com/ngneat/transloco-keys-manager/issues/87
          expected["Bob's Burgers"] =
            expected['another(test)'] =
            expected['last "one"'] =
              defaultValue;
          buildTranslationFiles({ ...config, format });
          assertTranslation({ type, expected, format });
        }
      );

      test.each(formats)('should work with scopes in %s format', (format) => {
        let expected = {
          '1': defaultValue,
          '2.1': defaultValue,
          '3.1': defaultValue,
          '4': defaultValue,
          '5': defaultValue,
        };

        buildTranslationFiles({ ...config, format });
        assertTranslation({ type, expected, path: 'admin-page/', format });
      });
    });

    describe('ngTemplate', () => {
      const type: TranslationCategory = 'ngTemplate';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      test.each(formats)(
        'should work with ngTemplate in %s format',
        (format) => {
          let expected = generateKeys({ end: 41 });
          buildTranslationFiles({ ...config, format });
          assertTranslation({ type, expected, format });
        }
      );

      test.each(formats)('should work with scopes in %s format', (format) => {
        let expected = {
          '1': defaultValue,
          '2.1': defaultValue,
          '3.1': defaultValue,
          '4': defaultValue,
          '5': defaultValue,
        };

        buildTranslationFiles({ ...config, format });
        assertTranslation({ type, expected, path: 'todos-page/', format });
      });
    });

    describe('read', () => {
      const type: TranslationCategory = 'read';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      test.each(formats)('should work with read in %s format', (format) => {
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

        buildTranslationFiles({ ...config, format });
        assertTranslation({ type, expected: expected.global, format });
        assertTranslation({
          type,
          expected: expected.todos,
          path: 'todos-page/',
          format,
        });
      });
    });
  });

  describe('Typescript Extraction', () => {
    describe('service', () => {
      const type: TranslationCategory = 'service';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      test.each(formats)('should work with service in %s format', (format) => {
        const expected = {
          ...generateKeys({ end: 19 }),
          ...{ '20.21.22.23': defaultValue },
          ...generateKeys({ start: 24, end: 33 }),
        };

        buildTranslationFiles({ ...config, format });
        assertTranslation({ type, expected, format });
      });

      test.each(formats)('should work with scopes in %s format', (format) => {
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

        buildTranslationFiles({ ...config, format });
        assertTranslation({
          type,
          expected: expected.todos,
          path: 'todos-page/',
          format,
        });
        assertTranslation({
          type,
          expected: expected.admin,
          path: 'admin-page/',
          format,
        });
        assertTranslation({
          type,
          expected: expected.nested,
          path: 'nested/scope/',
          format,
        });
      });

      test.each(formats)(
        'should work when passing an array of keys in %s format',
        (format) => {
          const expected = generateKeys({ start: 26, end: 33 });

          buildTranslationFiles({ ...config, format });
          assertPartialTranslation({ type, expected, format });
        }
      );
    });

    describe('marker', () => {
      const type: TranslationCategory = 'marker';

      beforeEach(() => removeI18nFolder(type));

      test.each(formats)('should work with marker in %s format', (format) => {
        const config = gConfig(type);

        let expected = {};
        expected['username4'] = defaultValue;
        expected['password4'] = defaultValue;
        expected['username'] = defaultValue;
        expected['password'] = defaultValue;
        buildTranslationFiles({ ...config, format });
        assertTranslation({ type, expected, format });
      });
    });

    describe('inline template', () => {
      const type: TranslationCategory = 'inline-template';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      test.each(formats)(
        'should work with inline templates in %s format',
        (format) => {
          const expected = generateKeys({ end: 23 });
          ['Processing archive...', 'Restore Options'].forEach(
            (nonNumericKey) => {
              expected[nonNumericKey] = defaultValue;
            }
          );
          buildTranslationFiles({ ...config, format });
          assertTranslation({ type, expected, format });
        }
      );
    });
  });

  describe('Config', () => {
    describe('unflat', () => {
      const type: TranslationCategory = 'unflat';
      const config = gConfig(type, { unflat: true });

      beforeEach(() => removeI18nFolder(type));

      test.each(formats)(
        'show work with unflat true in %s format',
        (format) => {
          const expected = {
            global: {
              a: {
                '1': defaultValue,
              },
            },
          };
          buildTranslationFiles({ ...config, format });
          assertTranslation({ type, expected: expected.global, format });
        }
      );
    });

    describe('unflat-sort', () => {
      const type: TranslationCategory = 'unflat-sort';
      const config = gConfig(type, { unflat: true, sort: true });

      beforeEach(() => removeI18nFolder(type));

      test.each(formats)(
        'show work with unflat and sort true in %s format',
        (format) => {
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
          buildTranslationFiles({ ...config, format });
          assertTranslation({ type, expected: expected.global, format });
        }
      );
    });

    describe('Unflat problematic keys', () => {
      const type: TranslationCategory = 'unflat-problematic-keys';
      const config = gConfig(type, { unflat: true });
      const spy = jest.spyOn(messages, 'problematicKeysForUnflat');

      beforeEach(() => removeI18nFolder(type));

      test.each(formats)(
        'show work with unflat true and problematic keys in %s format',
        (format) => {
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
          buildTranslationFiles({ ...config, format });
          assertTranslation({ type, expected: expected.global, format });
        }
      );

      afterAll(() => {
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

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(expectedProblematicKeys);
      });
    });

    describe('Multi Inputs', () => {
      const type: TranslationCategory = 'multi-input';
      const config = gConfig(type, {
        input: [`${type}/folder-1`, `${type}/folder-2`],
      });

      beforeEach(() => removeI18nFolder(type));

      test.each(formats)(
        'show work with multiple inputs in %s format',
        (format) => {
          let expected = generateKeys({ end: 39 });
          buildTranslationFiles({ ...config, format });
          assertTranslation({ type, expected, format });
        }
      );

      test.each(formats)('should work with scopes in %s format', (format) => {
        let expected = {
          '1': defaultValue,
          '2.1': defaultValue,
          '3.1': defaultValue,
          '4': defaultValue,
          '5': defaultValue,
        };

        buildTranslationFiles({ ...config, format });
        assertTranslation({ type, expected, path: 'admin-page/', format });
      });
    });
  });

  describe('comments', () => {
    const type: TranslationCategory = 'comments';
    const config = gConfig(type);

    beforeEach(() => removeI18nFolder(type));

    test.each(formats)('show work with comments in %s format', (format) => {
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
      buildTranslationFiles({ ...config, format });

      assertTranslation({ type, expected: expected.global, format });
      assertTranslation({
        type,
        expected: expected.admin,
        path: 'admin/',
        format,
      });
    });
  });
});
