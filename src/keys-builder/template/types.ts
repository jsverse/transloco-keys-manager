import { ParseError, TmplAstNode } from '@angular/compiler';
import type { ExtractorConfig } from '../../types.js';

export interface ParsedTemplateResult {
  nodes: TmplAstNode[];
  errors: ParseError[] | null;
  [key: string]: any;
}

export interface TemplateExtractorConfig extends ExtractorConfig {
  content?: string;
  parsedTemplate?: ParsedTemplateResult;
}

export interface ContainersMetadata {
  containerContent: string;
  read?: string;
}
