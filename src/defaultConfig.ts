import { Config } from './types';

export const defaultConfig: Config = {
  // The source directory for all files using the translation keys
  input: 'src',

   // The target directory for all generated translation files
  output: 'src/assets/i18n',

  // The marker sign for dynamic values
  marker: 't',

  // The languages files to generate
  langs: ['en'],

  /**
   *  Relevant only for the Extractor
   */

  // The default value of a generated key
  defaultValue: undefined,

  // Replace the contents of a translation file (if it exists) with the generated one (default value is false, in which case files are merged)
  replace: false,
  

  /**
   *   Relevant only for the Detective
   */

  // Add missing keys that were found by the detective (default value is false)
  addMissingKeys: false,

  // The path for the root translation files (for example: assets/i18n)
  translationsPath: 'src/assets/i18n',
};
