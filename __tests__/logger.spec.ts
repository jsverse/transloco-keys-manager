import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import debug from 'debug';

vi.mock('ora', () => {
  const mockSpinner = {
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
  };
  return { default: vi.fn(() => mockSpinner) };
});

describe('logger', () => {
  const originalEnv = process.env.PRODUCTION;

  afterEach(() => {
    process.env.PRODUCTION = originalEnv;
    vi.restoreAllMocks();
  });

  describe('getLogger', () => {
    it('should return a logger with log, success, and startSpinner methods', async () => {
      const { getLogger } = await import('../src/utils/logger');
      const logger = getLogger();
      expect(logger).toHaveProperty('log');
      expect(logger).toHaveProperty('success');
      expect(logger).toHaveProperty('startSpinner');
    });
  });

  describe('devlog', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('should return early if debug namespace is not enabled', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      debug.disable();

      const { devlog } = await import('../src/utils/logger');
      devlog('config', 'Test', { key: 'value' });

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should log debug output when namespace is enabled', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      debug.enable('tkm:config');

      const { devlog } = await import('../src/utils/logger');
      devlog('config', 'MyTag', { myVar: 'myValue' });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('DEBUG - MyTag'),
      );
      debug.disable();
      consoleSpy.mockRestore();
    });

    it('should log each variable in values', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      debug.enable('tkm:extraction');

      const { devlog } = await import('../src/utils/logger');
      devlog('extraction', 'Extract', { a: 1, b: 'two' });

      // The header + debug log calls
      expect(consoleSpy).toHaveBeenCalled();
      debug.disable();
      consoleSpy.mockRestore();
    });
  });
});
