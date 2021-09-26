import { ExtractorConfig } from '../../types';

export interface TemplateExtractorConfig extends ExtractorConfig {
  content?: string;
}

export interface ContainersMetadata {
  containerContent: string;
  read?: string;
}
