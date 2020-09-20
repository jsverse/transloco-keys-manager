// import-conductor-skip
jest.mock('../src/helpers/resolveProjectBasePath');
jest.mock('@ngneat/transloco-utils');
import { getConfig } from '@ngneat/transloco-utils';
import chalk from 'chalk';
import * as path from 'path';

import { defaultConfig as _defaultConfig } from '../src/defaultConfig';
import { resolveConfig } from '../src/helpers/resolveConfig';
import { resolveProjectBasePath } from '../src/helpers/resolveProjectBasePath';
import { messages } from '../src/messages';

describe('resolveConfig', () => {
  const sourceRoot = '__tests__';
  const inlineConfig = { defaultValue: 'test2', input: ['somePath'] };
  let spies;
  let defaultConfig = _defaultConfig();
  beforeAll(() => {
    (resolveProjectBasePath as any).mockImplementation(() => {
      return { projectBasePath: sourceRoot };
    });
    (getConfig as any).mockImplementation(() => ({}));
    spies = [spyOn(process, 'exit'), spyOn(console, 'log')];
  });

  function resolvePath(configPath: string | string[], asArray = false) {
    const resolve = p => path.resolve(process.cwd(), sourceRoot, p);
    if (Array.isArray(configPath)) {
      return configPath.map(resolve);
    }

    return asArray ? [resolve(configPath)] : resolve(configPath);
  }

  function assertConfig(expected, inline = {}) {
    const { scopes, ...config } = resolveConfig(inline);
    expect(config).toEqual(expected);
    expect(scopes).toBeDefined();
  }

  it('should return the default config', () => {
    const expected = {
      ...defaultConfig,
      input: resolvePath(defaultConfig.input),
      output: resolvePath(defaultConfig.output),
      translationsPath: resolvePath(defaultConfig.translationsPath)
    };
    assertConfig(expected);
  });

  it('should merge the default and inline config ', () => {
    const expected = {
      ...defaultConfig,
      defaultValue: inlineConfig.defaultValue,
      input: resolvePath(inlineConfig.input),
      output: resolvePath(defaultConfig.output),
      translationsPath: resolvePath(defaultConfig.translationsPath)
    };
    assertConfig(expected, inlineConfig);
  });

  describe('with transloco config', () => {
    const translocoConfig = {
      rootTranslationsPath: '1/2',
      langs: ['en', 'jp'],
      keysManager: {
        defaultValue: 'test',
        input: 'test',
        output: 'assets/override'
      }
    };

    beforeAll(() => (getConfig as any).mockImplementation(() => translocoConfig));
    afterAll(() => (getConfig as any).mockImplementation(() => ({})));

    it('should merge the default and the transloco config', () => {
      const expected = {
        ...defaultConfig,
        defaultValue: translocoConfig.keysManager.defaultValue,
        input: resolvePath(translocoConfig.keysManager.input, true),
        output: resolvePath(translocoConfig.keysManager.output),
        translationsPath: resolvePath(translocoConfig.rootTranslationsPath),
        langs: translocoConfig.langs
      };
      assertConfig(expected);
    });

    it('should merge the default, transloco config and inline config ', () => {
      const expected = {
        ...defaultConfig,
        defaultValue: inlineConfig.defaultValue,
        input: resolvePath(inlineConfig.input),
        output: resolvePath(translocoConfig.keysManager.output),
        translationsPath: resolvePath(translocoConfig.rootTranslationsPath),
        langs: translocoConfig.langs
      };
      assertConfig(expected, inlineConfig);
    });
  });

  describe('validate directories', () => {
    function shouldFail(prop: string, msg: 'pathDoesntExists' | 'pathIsNotDir') {
      expect(process.exit).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(chalk.bgRed.black(`${prop} ${messages[msg]}`));
      resetSpies();
    }

    function shouldPass() {
      [process.exit, console.log].forEach(s => expect(s).not.toHaveBeenCalled());
      resetSpies();
    }

    function resetSpies() {
      spies.forEach(s => s.calls.reset());
    }

    it('should fail on invalid input path', () => {
      resolveConfig({ input: ['noFolder'] });
      shouldFail('Input', 'pathDoesntExists');
      resolveConfig({ input: ['comments', 'anotherMissingFolder'] });
      shouldFail('Input', 'pathDoesntExists');
      resolveConfig({ input: ['comments/1.html'] });
      shouldFail('Input', 'pathIsNotDir');
    });

    it('should fail on invalid translations path', () => {
      /* should only fail translation path when in find mode */
      resolveConfig({ input: ['comments'], translationsPath: 'noFolder' });
      shouldPass();
      resolveConfig({ input: ['comments'], translationsPath: 'noFolder', command: 'extract' });
      shouldPass();
      resolveConfig({ input: ['comments'], translationsPath: 'noFolder', command: 'find' });
      shouldFail('Translations path', 'pathDoesntExists');
      resolveConfig({ input: ['comments'], translationsPath: 'comments/1.html', command: 'find' });
      shouldFail('Translations path', 'pathIsNotDir');
    });
  });

  describe('resolveConfigPaths', () => {
    it('should prefix all the paths in the config with the process cwd', () => {
      const config = resolveConfig({ input: ['comments'] });
      const assertPath = p => expect(p.startsWith(path.resolve(process.cwd(), sourceRoot))).toBe(true);
      config.input.forEach(assertPath);
      ['output', 'translationsPath'].forEach(prop => assertPath(config[prop]));
    });
  });
});
