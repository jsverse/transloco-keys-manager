import type { ExtractorConfig } from '../../types.js';

export interface TemplateExtractorConfig extends ExtractorConfig {
  content?: string;
}

export interface ContainersMetadata {
  containerContent: string;
  read?: string;
}
