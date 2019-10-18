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
};

export type ExtractionResult = {
  scopeToKeys: object;
  fileCount: number;
};

export type Scopes = {
  scopeToAlias: object;
  aliasToScope: object;
};

export type ExtractorConfig = {
  file: string;
  scopes: Scopes;
  defaultValue: string;
  scopeToKeys: any;
};

export type ScopeMap = {
  __global: object;
  [scope: string]: object;
};
