import { defaultConfig } from '../src/config';
import { Format } from '../src/types';

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

  it('should set the format to "json"', () => {
    let { format } = defaultConfig();
    expect(format).toEqual(Format.Json);
  });
});
