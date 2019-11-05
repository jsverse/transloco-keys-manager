/**
 *  All Rights Reserved.
 *
 *  COPYING THIS CODE IS PROHIBITED
 *
 */
import { sanitizeForRegex } from './helpers/sanitizeForRegex';

export const regexs = {
  templateKey: varName => new RegExp(`${varName}\\((?![^,)+]*\\+)('|")(?<key>[^)"']*?)\\1`, 'g'),
  directive: () => new RegExp(`\\stransloco\\s*=\\s*("|')(?<key>[^]+?)\\1`, 'g'),
  directiveTernary: () => new RegExp(`\\s\\[transloco\\]\\s*=\\s*("|')[^"'?]*\\?(?<key>[^]+?)\\1`, 'g'),
  pipe: () =>
    /(?:(?:\{\{(?![^^}\|+]*\+)[^}\|'"]*)|(?:\[[^\]]*\]=(?:"|')(?![^'"+]*\+)[^'"]*))('|")(?<key>[^'"[>=]*?)\1[^'"\|[}]*(?:('|")(?<key2>[^"'[>]*?)\3)?[^\|}>[]*?\|[^}>]*?transloco/g,
  fileLang: outputPath =>
    new RegExp(`${sanitizeForRegex(outputPath)}\\/(?:(?<scope>(?:[^\\.]*)*)\\/)?(?<fileLang>[^./]*)\\.json`),
  serviceInjection: /[^]*(?=(?:private|protected|public)\s+(?<serviceName>[^,:()]+)\s*:\s*(?:TranslocoService\s*(?:,|\))))[^]*/,
  translationCalls: (serviceName?: string) => {
    const serviceRgx =
      serviceName &&
      `|(?:(?:(?:\\s*|this\\.)${sanitizeForRegex(
        serviceName
      )})(?:\\s*\\t*\\r*\\n*)*\\.(?:\\s*\\t*\\r*\\n*)*(?:translate|selectTranslate))`;
    return new RegExp(
      `(?:translate${serviceRgx ||
        ''})\\((?![^\`"')+]*(?:\\+|(?:(\`|'|")(?:[^\`'"]*\\1[^+),]*\\+)|(?:(?:[^,]*,){2}[^"'\`+]*\\+))))[^\`"')+]*(?:(?:\`(?!(?:[^$\`]*\\$\\{))(?<backtickKey>[^\`]*?)\`)|(?:('|")(?<key>[^"']*)\\3))([^\`'"){]*)(?:{(?:(?:[^{}])(?:{[^}]*?})?)*}\\s*(?:,[^\`'")]*(?:(?:\`(?!(?:[^$\`]*\\$\\{))(?<backtickScope>[^\`]*)\`)|(?:("|')(?<scope>[^"']*)\\7)))?)?\\)`,
      'g'
    );
  },
  tsCommentsSection: () => /\/\*\*[^]+?\*\//g,
  templateCommentsSection: () => /<!--[^-]+?-->/g,
  markerValues: marker => new RegExp(`${sanitizeForRegex(marker)}\\(([^)]+)\\)`, 'g'),
  /** use the translate function directly */
  directImport: /import\s*{\s*[^}]*translate[^}]*}\s*from\s*("|')@ngneat\/transloco\1/
};
