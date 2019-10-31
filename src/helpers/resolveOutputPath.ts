import { Config } from '../types';

export function resolveOutputPath(output: Config['output']) {
  return `${process.cwd()}/${output}`;
}
