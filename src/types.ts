export type Config = {
  input?: string;
  translationsPath?: string;
  langs?: string[];
  defaultValue?: undefined | string;
  replace?: boolean;
  addMissingKeys?: boolean;
  prodMode?: boolean;
  scopes?: any;
  files?: any;
}

export type ExtractionResult = {
  keys: object;
  fileCount: number;
}

export type ExtractorConfig = {
  file: string;
  scopes: any;
  defaultValue: string;
  keys: any;
};
