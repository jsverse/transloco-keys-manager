import { defaultConfig } from '../src/config';
import { describe, expect, it } from 'vitest';

describe('defaultConfig', () => {
  it('should set the input path to "app"', () => {
    let { input } = defaultConfig();
    expect(input).toEqual(['src/app']);
    input = defaultConfig({ projectType: 'application' }).input;
    expect(input).toEqual(['src/app']);
  });

  it('should set the input path to "lib"', () => {
    let { input } = defaultConfig({ projectType: 'library' });
    expect(input).toEqual(['src/lib']);
  });

  it('should set the output format to "json"', () => {
    expect(defaultConfig({}).fileFormat).toEqual('json');
  });
});
