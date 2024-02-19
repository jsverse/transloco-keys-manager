import { jest } from '@jest/globals';

export function noop() {}

export function spyOnLog() {
  return jest.spyOn(console, 'log').mockImplementation(noop);
}

export function spyOnWarn() {
  return jest.spyOn(console, 'warn').mockImplementation(noop);
}
