import { defaultConfig } from '../src/config';

describe('defaultConfig', () => {
  it('should set the input path to "app"', () => {
    let { input } = defaultConfig();
    expect(input).toEqual(['app']);
    input = defaultConfig('application').input;
    expect(input).toEqual(['app']);
  });

  it('should set the input path to "lib"', () => {
    let { input } = defaultConfig('library');
    expect(input).toEqual(['lib']);
  });

  it('should set the output format to "json"', () => {
    let { outputFormat } = defaultConfig();
    expect(outputFormat).toEqual('json');
  });
});
