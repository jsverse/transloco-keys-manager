module.exports = {
  // Paths you would like to extract strings from.
  // You can use path expansion, glob patterns and multiple
  input: 'src',

  // Where are the main translation files
  translationsPath: 'src/assets/i18n',

  // Which languages files to generate
  langs: ['en'],

  /**
   *  Relevant only for the Extractor
   */

  // What's the default value for a generated key
  defaultValue: '',

  // Replace the contents of output file if it exists (Merges by default)
  replace: false,

  /**
   *   Relevant only for the Detective
   */

  // Whether to add missing keys that were found by the detective
  addMissingKeys: true
};
