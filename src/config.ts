import { Config } from './types';

let config: Config;

export function setConfig(_config: Config) {
  config = _config;
}

export function getConfig(): Config {
  return config;
}

export type ProjectType = 'application' | 'library';

export function defaultConfig(
  projectType: ProjectType = 'application',
): Omit<
  Config,
  | 'config'
  | 'project'
  | 'scopes'
  | 'scopePathMap'
  | 'unflat'
  | 'command'
  | 'files'
> {
  const isApp = projectType === 'application';

  return {
    // The source directory for all files using the translation keys
    input: [isApp ? 'app' : 'lib'],

    // The target directory for all generated translation files
    output: 'assets/i18n',

    // The language files to generate
    langs: ['en'],

    // The marker sign for dynamic values
    marker: 't',

    // Whether to sort the keys
    sort: false,

    /**
     *  Relevant only for the Extractor
     */

    // The default value of a generated key
    defaultValue: undefined,

    // Replace the contents of a translation file (if it exists) with the generated one (default value is false, in which case files are merged)
    replace: false,

    // Remove missing keys from existing translation files
    removeExtraKeys: false,

    /**
     *   Relevant only for the Detective
     */

    // Add missing keys that were found by the detective (default value is false)
    addMissingKeys: false,

    // Emit an error and exit the process if extra keys were found (defaults to `false`)
    emitErrorOnExtraKeys: false,

    // The path for the root translation files (for example: assets/i18n)
    translationsPath: 'assets/i18n',

    // The translation files format (`json`, `pot`) default is `json`
    fileFormat: 'json',

    // Set a default-language for the marke default value. Default is 'en'
    defaultLanguage: 'en',

    // Set a work directory. Defaults to current folder
    workdir: '',

    // Set a pipe argument that contains the default value for the translation in the default language. Default is 'Default'
    defaultPipeArgument: 'Default',

    // Override the trranslation file value if the default doesn't match the current value. This will not change the non-default language keys, but the key will be logged in the log
    defaultOverrideExisting: false,
  };
}
