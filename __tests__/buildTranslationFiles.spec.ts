// import-conductor-skip

jest.mock('../src/utils/resolve-project-base-path');
import * as fs from 'fs-extra';

import { buildTranslationFiles } from '../src/keys-builder';
import { messages } from '../src/messages';
import { resolveProjectBasePath } from '../src/utils/resolve-project-base-path';

const sourceRoot = '__tests__';

const m = 'missing';

function gKeys(len: number, prefix?: string) {
  let expected = {};
  for (let i = 1; i <= len; i++) {
    expected[prefix ? `${prefix}.${i}` : i] = m;
  }

  return expected;
}

function gConfig(type, config = {}) {
  return {
    input: [`${type}`],
    output: `${type}/i18n`,
    langs: ['en', 'es', 'it'],
    defaultValue: 'missing',
    ...config,
  };
}

function assertResult(type: string, expected: object, path?: string) {
  const translation = fs.readJsonSync(
    `./${sourceRoot}/${type}/i18n/${path || ''}en.json`
  );
  expect(translation).toEqual(expected);
}

function removeI18nFolder(type: string) {
  fs.removeSync(`./${sourceRoot}/${type}/i18n`);
}

describe('buildTranslationFiles', () => {
  beforeAll(() => {
    (resolveProjectBasePath as any).mockImplementation(() => {
      return { projectBasePath: sourceRoot };
    });
  });

  describe('Template Extraction', () => {
    describe('Pipe', () => {
      const type = 'pipe';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with pipe', () => {
        let expected = gKeys(48);
        expected['49.50.51.52'] = m;
        for (let i = 53; i <= 62; i++) {
          expected[i] = m;
        }
        expected['63.64.65'] = m;
        for (let i = 66; i < 68; i++) {
          expected[i] = m;
        }
        [
          'Restore Options',
          'Processing archive...',
          'admin.1',
          'admin.2',
          'admin.3',
        ].forEach((nonNumericKey) => {
          expected[nonNumericKey] = m;
        });

        buildTranslationFiles(config);
        assertResult(type, expected);
      });
    });

    describe('Directive', () => {
      const type = 'directive';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with directive', () => {
        const expected = gKeys(23);
        ['Processing archive...', 'Restore Options'].forEach(
          (nonNumericKey) => {
            expected[nonNumericKey] = m;
          }
        );
        buildTranslationFiles(config);
        assertResult(type, expected);
      });
    });

    describe('ngContainer', () => {
      const type = 'ngContainer';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with ngContainer', () => {
        let expected = gKeys(39);
        // See https://github.com/ngneat/transloco-keys-manager/issues/87
        expected["Bob's Burgers"] =
          expected['another(test)'] =
          expected['last "one"'] =
            m;
        buildTranslationFiles(config);
        assertResult(type, expected);
      });

      it('should work with scopes', () => {
        let expected = {
          '1': 'missing',
          '2.1': 'missing',
          '3.1': 'missing',
          '4': 'missing',
          '5': 'missing',
        };

        buildTranslationFiles(config);
        assertResult(type, expected, 'admin-page/');
      });
    });

    describe('ngTemplate', () => {
      const type = 'ngTemplate';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with ngTemplate', () => {
        let expected = gKeys(35);
        buildTranslationFiles(config);
        assertResult(type, expected);
      });

      it('should work with scopes', () => {
        let expected = {
          '1': 'missing',
          '2.1': 'missing',
          '3.1': 'missing',
          '4': 'missing',
          '5': 'missing',
        };

        buildTranslationFiles(config);
        assertResult(type, expected, 'todos-page/');
      });
    });

    describe('read', () => {
      const type = 'read';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with read', () => {
        const expected = {
          global: {
            ...gKeys(3),
            ...gKeys(23, 'site-header.navigation.route'),
            ...gKeys(5, 'site-header.navigation'),
            ...gKeys(10, 'right-pane.actions'),
            ...gKeys(1, 'templates.translations'),
            ...gKeys(3, 'nested.translation'),
            ...gKeys(3, 'some.other.nested.that-is-tested'),
            ...gKeys(12, 'ternary.nested'),
            ...gKeys(2, 'nested'),
            ...gKeys(2, 'site-header.navigation.route.nested'),
          },
          todos: {
            ...gKeys(2, 'numbers'),
          },
        };

        buildTranslationFiles(config);
        assertResult(type, expected.global);
        assertResult(type, expected.todos, 'todos-page/');
      });
    });
  });

  describe('Typescript Extraction', () => {
    describe('service', () => {
      const type = 'service';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with service', () => {
        let expected = gKeys(19);
        expected['20.21.22.23'] = 'missing';
        expected['24'] = 'missing';
        expected['25'] = 'missing';
        buildTranslationFiles(config);
        assertResult(type, expected);
      });

      it('should work with scopes', () => {
        const expected = {
          todos: {
            '1': 'missing',
            '2.1': 'missing',
          },
          admin: {
            '3.1': 'missing',
            '4': 'missing',
          },
          nested: {
            '5': 'missing',
            '6.1': 'missing',
          },
        };

        buildTranslationFiles(config);
        assertResult(type, expected.todos, 'todos-page/');
        assertResult(type, expected.admin, 'admin-page/');
        assertResult(type, expected.nested, 'nested/scope/');
      });
    });

    describe('marker', () => {
      const type = 'marker';

      beforeEach(() => removeI18nFolder(type));

      it('should work with marker', () => {
        const config = gConfig(type);

        let expected = {};
        expected['username4'] = 'missing';
        expected['password4'] = 'missing';
        expected['username'] = 'missing';
        expected['password'] = 'missing';
        buildTranslationFiles(config);
        assertResult(type, expected);
      });
    });

    describe('inline template', () => {
      const type = 'inline-template';
      const config = gConfig(type);

      beforeEach(() => removeI18nFolder(type));

      it('should work with inline templates', () => {
        const expected = gKeys(23);
        ['Processing archive...', 'Restore Options'].forEach(
          (nonNumericKey) => {
            expected[nonNumericKey] = m;
          }
        );
        buildTranslationFiles(config);
        assertResult(type, expected);
      });
    });
  });

  describe('Config', () => {
    describe('unflat', () => {
      const type = 'unflat';
      const config = gConfig(type, { unflat: true });

      beforeEach(() => removeI18nFolder(type));

      it('show work with unflat true', () => {
        const expected = {
          global: {
            a: {
              '1': m,
            },
          },
        };
        buildTranslationFiles(config);

        assertResult(type, expected.global);
      });
    });

    describe('unflat-sort', () => {
      const type = 'unflat-sort';
      const config = gConfig(type, { unflat: true, sort: true });

      beforeEach(() => removeI18nFolder(type));

      it('show work with unflat and sort true', () => {
        const expected = {
          global: {
            b: {
              b: {
                a: m,
                b: m,
              },
              c: {
                a: m,
                p: m,
                x: m,
              },
            },
          },
        };
        buildTranslationFiles(config);

        assertResult(type, expected.global);
      });
    });

    describe('Unflat problematic keys', () => {
      const type = 'unflat-problematic-keys';
      const config = gConfig(type, { unflat: true });

      beforeEach(() => removeI18nFolder(type));

      it('show work with unflat true and problematic keys', () => {
        const spy = jest.spyOn(messages, 'problematicKeysForUnflat');

        const expected = {
          global: {
            a: m,
            b: m,
            c: m,
            d: {
              '1': m,
              '2': m,
            },
            e: {
              a: m,
              aa: m,
            },
            f: m,
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
        buildTranslationFiles(config);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(expectedProblematicKeys);
        assertResult(type, expected.global);
      });
    });

    describe('Multi Inputs', () => {
      const type = 'multi-input';
      const config = gConfig(type, {
        input: [`${type}/folder-1`, `${type}/folder-2`],
      });

      beforeEach(() => removeI18nFolder(type));

      it('show work with multiple inputs', () => {
        let expected = gKeys(39);
        buildTranslationFiles(config);
        assertResult(type, expected);
      });

      it('should work with scopes', () => {
        let expected = {
          '1': 'missing',
          '2.1': 'missing',
          '3.1': 'missing',
          '4': 'missing',
          '5': 'missing',
        };

        buildTranslationFiles(config);
        assertResult(type, expected, 'admin-page/');
      });
    });
  });

  describe('comments', () => {
    const type = 'comments';
    const config = gConfig(type);

    beforeEach(() => removeI18nFolder(type));

    it('show work with comments', () => {
      const expected = {
        global: {
          'a.some.key': m,
          'b.some.key': m,
          'c.some.key': m,
          'need.transloco': m,
          '1.some': m,
          ...gKeys(8),
          '10': m,
          '13': m,
          '11.12': m,
          'hey.man': m,
          'whats.app': m,
          '101': m,
          '111.12': m,
          hello: m,
          'hey1.man': m,
          'whats1.app': m,
          hello1: m,
          '131': m,
          ...gKeys(5, '10'),
          '10.6.7': m,
          '11': m,
          '11.1': m,
          '11.2.3': m,
          '200': m,
          '201': m,
          '202': m,
          '203.204': m,
          '205': m,
          '206': m,
          '207.208': m,
          '209': m,
          '210': m,
          '211': m,
          '212': m,
          '213.214': m,
          '215': m,
          '216': m,
          '217.218': m,
          'from.comment': m,
          'pretty.cool.da': m,
          ...gKeys(4, 'global'),
          ...gKeys(8, 'outer.read'),
          ...gKeys(4, 'inner.read'),
          ...gKeys(2, 'another.container'),
        },
        admin: {
          '1': m,
          '2.3': m,
          '4': m,
          '5555': m,
        },
      };
      buildTranslationFiles(config);

      assertResult(type, expected.global);
      assertResult(type, expected.admin, 'admin/');
    });
  });
});
