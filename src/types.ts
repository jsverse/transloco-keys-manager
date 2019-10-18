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

export type Scopes = {
  scopeMap: object;
  aliasMap: object;
}

export type ExtractorConfig = {
  file: string;
  scopes: Scopes;
  defaultValue: string;
  keys: any;
};

export type ScopeMap = {
  __global: object;
  [scope: string]: object;
};
