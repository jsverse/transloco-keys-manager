import { defaultConfig } from '../src/defaultConfig';

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
});
