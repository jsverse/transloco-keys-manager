import { Config } from '../types';

export function resolveOutputPath(config: Config) {
  return `${process.cwd()}/${config.translationsPath}`;
}
