import { describe, it, expect, vi, beforeEach } from 'vitest';
import { compareKeysToFiles } from '../src/keys-detective/compare-keys-to-files';
import { buildTable } from '../src/keys-detective/build-table';
import { normalizedGlob } from '../src/utils/normalize-glob-path';
import { readFile, writeFile } from '../src/utils/file.utils';
import { getTranslationFilesPath } from '../src/keys-detective/get-translation-files-path';

vi.mock('../src/utils/logger', () => ({
  getLogger: () => ({
    log: vi.fn(),
    success: vi.fn(),
    startSpinner: vi.fn(),
  }),
}));

vi.mock('../src/keys-detective/build-table', () => ({
  buildTable: vi.fn(),
}));

vi.mock('../src/utils/normalize-glob-path', () => ({
  normalizedGlob: vi.fn(() => []),
}));

vi.mock('../src/keys-detective/get-translation-files-path', () => ({
  getTranslationFilesPath: vi.fn(() => []),
}));

vi.mock('../src/utils/file.utils', () => ({
  readFile: vi.fn(() => ({})),
  writeFile: vi.fn(),
}));

vi.mock('@jsverse/transloco-utils', () => ({
  getGlobalConfig: () => ({ scopePathMap: {} }),
}));

describe('compareKeysToFiles', () => {
  const mockBuildTable = vi.mocked(buildTable);
  const mockNormalizedGlob = vi.mocked(normalizedGlob);
  const mockReadFile = vi.mocked(readFile);
  const mockWriteFile = vi.mocked(writeFile);
  const mockGetTranslationFilesPath = vi.mocked(getTranslationFilesPath);

  beforeEach(() => {
    vi.clearAllMocks();
    mockNormalizedGlob.mockReturnValue([]);
    mockGetTranslationFilesPath.mockReturnValue([]);
    mockReadFile.mockImplementation(((path: string, opts?: any) => {
      if (opts?.parse) return {};
      return '{}';
    }) as any);
  });

  it('should call buildTable with empty langs when no translation files', () => {
    compareKeysToFiles({
      scopeToKeys: { __global: { key: 'value' } },
      translationsPath: '/tmp/i18n',
      addMissingKeys: false,
      emitErrorOnExtraKeys: false,
      fileFormat: 'json',
      unflat: false,
    });

    expect(mockBuildTable).toHaveBeenCalledWith(
      expect.objectContaining({ langs: [] }),
    );
  });

  it('should skip duplicate scopes via cache', () => {
    mockGetTranslationFilesPath.mockReturnValue([
      '/tmp/i18n/en.json',
      '/tmp/i18n/fr.json',
    ]);
    mockReadFile.mockImplementation(((path: string, opts?: any) => {
      if (opts?.parse) return { key: 'value' };
      return '{"key":"value"}';
    }) as any);
    mockNormalizedGlob.mockReturnValue(['/tmp/i18n/en.json']);

    compareKeysToFiles({
      scopeToKeys: { __global: { key: 'value' } },
      translationsPath: '/tmp/i18n',
      addMissingKeys: false,
      emitErrorOnExtraKeys: false,
      fileFormat: 'json',
      unflat: false,
    });

    // normalizedGlob called only once for __global scope (second file same scope = cached)
    expect(mockNormalizedGlob).toHaveBeenCalledTimes(1);
  });

  it('should detect missing keys and add them when addMissingKeys is true', () => {
    mockGetTranslationFilesPath.mockReturnValue(['/tmp/i18n/en.json']);
    mockReadFile.mockImplementation(((path: string, opts?: any) => {
      if (opts?.parse) return { existing: 'val' };
      return '{"existing":"val"}';
    }) as any);
    mockNormalizedGlob.mockReturnValue(['/tmp/i18n/en.json']);

    compareKeysToFiles({
      scopeToKeys: { __global: { existing: 'val', newKey: 'new' } },
      translationsPath: '/tmp/i18n',
      addMissingKeys: true,
      emitErrorOnExtraKeys: false,
      fileFormat: 'json',
      unflat: false,
    });

    expect(mockWriteFile).toHaveBeenCalled();
    expect(mockBuildTable).toHaveBeenCalledWith(
      expect.objectContaining({
        addMissingKeys: true,
      }),
    );
  });

  it('should exclude comment deletions from extra keys', () => {
    mockGetTranslationFilesPath.mockReturnValue(['/tmp/i18n/en.json']);
    mockReadFile.mockImplementation(((path: string, opts?: any) => {
      if (opts?.parse) return { key: 'value', 'key.comment': 'a comment' };
      return '{}';
    }) as any);
    mockNormalizedGlob.mockReturnValue(['/tmp/i18n/en.json']);

    compareKeysToFiles({
      scopeToKeys: { __global: { key: 'value' } },
      translationsPath: '/tmp/i18n',
      addMissingKeys: false,
      emitErrorOnExtraKeys: false,
      fileFormat: 'json',
      unflat: false,
    });

    expect(mockBuildTable).toHaveBeenCalledWith(
      expect.objectContaining({
        diffsPerLang: expect.objectContaining({
          en: expect.objectContaining({
            extra: [],
          }),
        }),
      }),
    );
  });

  it('should handle scoped translation files', () => {
    mockGetTranslationFilesPath.mockReturnValue(['/tmp/i18n/admin/en.json']);
    mockReadFile.mockImplementation(((path: string, opts?: any) => {
      if (opts?.parse) return { key: 'value' };
      return '{"key":"value"}';
    }) as any);
    mockNormalizedGlob.mockReturnValue(['/tmp/i18n/admin/en.json']);

    compareKeysToFiles({
      scopeToKeys: {
        __global: {},
        admin: { key: 'value', newKey: 'new' },
      },
      translationsPath: '/tmp/i18n',
      addMissingKeys: false,
      emitErrorOnExtraKeys: false,
      fileFormat: 'json',
      unflat: false,
    });

    expect(mockBuildTable).toHaveBeenCalled();
  });

  it('should unflatten translation before writing when unflat is true', () => {
    mockGetTranslationFilesPath.mockReturnValue(['/tmp/i18n/en.json']);
    mockReadFile.mockImplementation(((path: string, opts?: any) => {
      if (opts?.parse) return {};
      return '{}';
    }) as any);
    mockNormalizedGlob.mockReturnValue(['/tmp/i18n/en.json']);

    compareKeysToFiles({
      scopeToKeys: { __global: { 'a.b': 'value' } },
      translationsPath: '/tmp/i18n',
      addMissingKeys: true,
      emitErrorOnExtraKeys: false,
      fileFormat: 'json',
      unflat: true,
    });

    expect(mockWriteFile).toHaveBeenCalledWith(
      '/tmp/i18n/en.json',
      expect.objectContaining({ a: { b: 'value' } }),
    );
  });
});
