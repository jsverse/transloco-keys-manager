import equal from 'lodash.isequal';
import * as fs from 'fs-extra';
import { buildTranslationFiles } from '../src/keysBuilder';

function gKeys(len: number, prefix?: string) {
  let expected = {};
  for(let i = 1; i <= len; i++) {
    expected[prefix ? `${prefix}.${i}` : i] = 'missing';
  }

  return expected;
}

function gConfig(type, config = {}) {
  return {
    "defaultValue": "missing",
    "input": `__tests__/${type}`,
    "langs": ['en', 'es', 'it'],
    "translationsPath": `__tests__/${type}/i18n`,
    "addMissingKeys": false,
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
      let expected = gKeys(17);
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
      // assertResult(type, expected.todos, 'todos-page/');
    });
  });

});


