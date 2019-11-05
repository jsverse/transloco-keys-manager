import equal from 'lodash.isequal';
import * as fs from 'fs-extra';
import diff from 'deep-diff';
import { buildTranslationFiles } from '../src/keysBuilder';

function gKeys(len: number, prefix?: string) {
  let expected = {};
  for(let i = 1; i <= len; i++) {
    expected[prefix ? `${prefix}.${i}` : i] = 'missing';
  }

  return expected;
}

const m = 'missing';

function gConfig(type, config = {}) {
  return {
    "input": `__tests__/${type}`,
    "output": `__tests__/${type}/i18n`,
    "langs": ['en', 'es', 'it'],
    "defaultValue": "missing",
    ...config
  };
}

function assertResult(type: string, expected: object, path?: string) {
  const translation = fs.readJsonSync(`./__tests__/${type}/i18n/${path || ''}en.json`);
  expect(equal(translation, expected)).toBe(true);
}

describe('buildTranslationFiles', () => {

  describe('Pipe', () => {
    const type = 'pipe', config = gConfig(type);

    beforeEach(() => fs.removeSync(`./__tests__/${type}/i18n`));

    it('should work with pipe', () => {
      let expected = gKeys(48);
      expected['63.64.65'] = expected['49.50.51.52'] = m;
      for (let i = 53; i <= 62; i++) {
        expected[`${i}`] = m;
      }
      buildTranslationFiles(config);
      assertResult(type, expected);
    });
  });

  describe('ngContainer', () => {
    const type = 'ngContainer', config = gConfig(type);

    beforeEach(() => fs.removeSync(`./__tests__/${type}/i18n`));

    it('should work with ngContainer', () => {
      let expected = gKeys(39);
      buildTranslationFiles(config);
      assertResult(type, expected);
    });

    it('should work with scopes', () => {
      let expected = {
        "1": "missing",
        "2.1": "missing",
        "3.1": "missing",
        "4": "missing",
        "5": "missing"
      };

      buildTranslationFiles(config);
      assertResult(type, expected, 'admin-page/');
    });
  });


  describe('ngTemplate', () => {
    const type = 'ngTemplate', config = gConfig(type);

    beforeEach(() => fs.removeSync(`./__tests__/${type}/i18n`));

    it('should work with ngTemplate', () => {
      let expected = gKeys(35);
      buildTranslationFiles(config);
      assertResult(type, expected);
    });

    it('should work with scopes', () => {
      let expected = {
        "1": "missing",
        "2.1": "missing",
        "3.1": "missing",
        "4": "missing",
        "5": "missing"
      };

      buildTranslationFiles(config);
      assertResult(type, expected, 'todos-page/');
    });
  });

  describe('service', () => {
    const type = 'service', config = gConfig(type);

    beforeEach(() => fs.removeSync(`./__tests__/${type}/i18n`));

    it('should work with service', () => {
      let expected = gKeys(19);
      expected["20.21.22.23"] = 'missing';
      expected["24"] = 'missing';
      expected["25"] = 'missing';
      buildTranslationFiles(config);
      assertResult(type, expected);
    });

    it('should work with scopes', () => {
      const expected = {
        todos: {
          "1": "missing",
          "2.1": "missing"
        },
        admin: {
          "3.1": "missing",
          "4": "missing",
        },
        nested: {
          "5": "missing",
          "6.1": "missing"
        }
      };

      buildTranslationFiles(config);
      assertResult(type, expected.todos, 'todos-page/');
      assertResult(type, expected.admin, 'admin-page/');
      assertResult(type, expected.nested, 'nested/scope/');
    });
  });

  describe('read', () => {
    const type = 'read', config = gConfig(type);

    beforeEach(() => fs.removeSync(`./__tests__/${type}/i18n`));

    it('should work with read', () => {
      const expected = {
        global: {
          ...gKeys(3),
          ...gKeys(21, 'site-header.navigation.route'),
          ...gKeys(5, 'site-header.navigation'),
          ...gKeys(10, 'right-pane.actions'),
          ...gKeys(1, 'templates.translations'),
          ...gKeys(3, 'nested.translation'),
          ...gKeys(3, 'some.other.nested.that-is-tested'),
        },
        todos: {
          ...gKeys(2, 'numbers'),
        }
      };

      buildTranslationFiles(config);
      assertResult(type, expected.global);
      assertResult(type, expected.todos, 'todos-page/');
    });
  });

  describe('comments', () => {
    const type = 'comments', config = gConfig(type);

    beforeEach(() => fs.removeSync(`./__tests__/${type}/i18n`));

    it('show work with comments', () => {
      const expected = {
        global: {
          'a.some.key': m,
          'b.some.key': m,
          'need.transloco': m,
          '1.some': m,
          '1': m,
          '2': m,
          '3': m,
          '4': m,
          '5': m,
          '6': m,
          '7': m,
          '8': m,
          '10': m,
          '13': m,
          '11.12': m,
          'hey.man': m,
          'whats.app': m,
          '101': m,
          '111.12': m,
          'hello': m,
          'hey1.man': m,
          'whats1.app': m,
          hello1: m,
          '131': m,
          '10.1': m,
          '10.2': m,
          '10.3': m,
          '10.4': m,
          '10.5': m,
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
        },
        admin: {
          '1': m,
          '2.3': m,
          '4': m,
          '5555': m
        }
      };
      buildTranslationFiles(config);

      assertResult(type, expected.global);
      assertResult(type, expected.admin, 'admin/');
    });

  });

});


