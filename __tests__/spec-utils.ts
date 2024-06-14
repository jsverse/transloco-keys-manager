import { jest } from '@jest/globals';
import type { SpyInstance } from 'jest-mock';

export function noop() {}

export function spyOnConsole(method: 'log' | 'warn'): SpyInstance {
  return jest.spyOn(console, method).mockImplementation(noop);
}

export function spyOnProcess(method: 'exit'): SpyInstance {
  return jest
    .spyOn(process, method)
    .mockImplementation(noop as any) as SpyInstance;
}

export function mockResolveProjectBasePath(projectBasePath: string) {
  jest.unstable_mockModule('../src/utils/resolve-project-base-path.ts', () => ({
    resolveProjectBasePath: jest.fn().mockReturnValue({ projectBasePath }),
  }));
}

export const defaultValue = 'missing';
