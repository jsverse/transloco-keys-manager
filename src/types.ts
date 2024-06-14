export type Config = {
  input: string[];
  config: string;
  project: string;
  translationsPath: string;
  langs: string[];
  defaultValue: undefined | string;
  replace: boolean;
  addMissingKeys: boolean;
  removeExtraKeys: boolean;
  emitErrorOnExtraKeys: boolean;
  scopes: Scopes;
  scopePathMap?: {
    [scopeAlias: string]: string;
  };
<<<<<<< HEAD
  files?: string[];
  output?: string;
  marker?: string;
  sort?: boolean;
  unflat?: boolean;
  command?: 'extract' | 'find';
  fileFormat?: FileFormats;
  defaultLanguage?: string;
  workdir?: string;
  defaultPipeArgument?: string;
  defaultOverrideExisting?: boolean;
=======
  files: string[];
  output: string;
  marker: string;
  sort: boolean;
  unflat: boolean;
  command: 'extract' | 'find';
  fileFormat: FileFormats;
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
};

export type FileFormats = 'json' | 'pot';
export type FileType = 'ts' | 'html';

export type ExtractionResult = {
  scopeToKeys: ScopeMap;
<<<<<<< HEAD
  defaults?: DefaultLanguageValue[];
  fileCount?: number;
=======
  fileCount: number;
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
};

export type ExtractorConfig = {
  file: string;
  scopes: Scopes;
  defaultValue?: string;
  scopeToKeys: ScopeMap;
  defaultPipeArgument: string;
  defaults: DefaultLanguageValue[];
};

export type Scopes = {
  // scope/path => scopePath
  scopeToAlias: {
    [scope: string]: string;
  };
  // scopePath => scope/path
  aliasToScope: {
    [scopeAlias: string]: string;
  };
};

export type ScopeMap = {
  __global: Record<string, string>;
  [scopePath: string]: Record<string, string>;
};

export type DefaultLanguageValue = {
  key: string;
  value: string;
};

export enum TEMPLATE_TYPE {
  STRUCTURAL,
  NG_TEMPLATE,
}

export type BaseParams = {
  defaultValue?: string;
  scopeToKeys: ScopeMap;
  scopes: Scopes;
};

export type Translation = Record<string, any>;
