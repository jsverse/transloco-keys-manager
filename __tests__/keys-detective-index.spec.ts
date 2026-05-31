import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findMissingKeys } from '../src/keys-detective';
import { Config } from '../src/types';

vi.mock('../src/config', () => ({
  setConfig: vi.fn(),
  getConfig: () => ({}),
}));

vi.mock('../src/utils/resolve-config', () => ({
  resolveConfig: (config: any) => ({
    ...config,
    translationsPath: '/tmp/i18n',
    fileFormat: 'json',
    addMissingKeys: false,
    emitErrorOnExtraKeys: false,
    unflat: false,
  }),
}));

vi.mock('../src/keys-detective/get-translation-files-path', () => ({
  getTranslationFilesPath: vi.fn().mockReturnValue([]),
}));

vi.mock('../src/keys-builder/build-keys', () => ({
  buildKeys: vi.fn().mockReturnValue({ scopeToKeys: {} }),
}));

vi.mock('../src/keys-detective/compare-keys-to-files', () => ({
  compareKeysToFiles: vi.fn(),
}));

vi.mock('../src/utils/logger', () => ({
  getLogger: () => ({
    log: vi.fn(),
    success: vi.fn(),
    startSpinner: vi.fn(),
  }),
}));

describe('findMissingKeys', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return early and log when no translation files found', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    findMissingKeys({} as Config);

    expect(consoleSpy).toHaveBeenCalledWith('No translation files found.');
    consoleSpy.mockRestore();
  });

  it('should call compareKeysToFiles when translation files exist', async () => {
    const { getTranslationFilesPath } =
      await import('../src/keys-detective/get-translation-files-path');
    (getTranslationFilesPath as any).mockReturnValue(['/tmp/i18n/en.json']);

    const { compareKeysToFiles } =
      await import('../src/keys-detective/compare-keys-to-files');

    findMissingKeys({} as Config);

    expect(compareKeysToFiles).toHaveBeenCalled();
  });
});
