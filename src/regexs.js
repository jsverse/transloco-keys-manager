const { sanitizeForRegex } = require('./helpers');

const regexs = {
  structural: /<([a-zA-Z-]*)[^*>]*\*transloco=('|")\s*let\s+(?<varName>\w*)[^>]*\2>[^]+?<\/\1\s*>/g,
  templateKey: varName => new RegExp(`${varName}(?:(?:\\[(?:'|"))|\\.)([^}|:]*)`, 'g'),
  template: /<ng-template[^>]*transloco[^>]*>[^]+?<\/ng-template>/g,
  directive: /\stransloco\s*=\s*("|')(?<key>[^]+?)\1/g,
  directiveTernary: /\s\[transloco\]\s*=\s*("|')[^"'?]*\?(?<key>[^]+?)\1/g,
  pipe: /(?:(?:{{(?![^^}|'"+]*\+)[^}|'"]*)|(?:\[[^\]]*\]=(?:"|')(?![^'"+]*\+)[^'"]*))('|")(?<key>[^|}>]*)\|[^}>]*transloco/g,
  fileLang: outputPath =>
    new RegExp(`${sanitizeForRegex(outputPath)}\\/(?:(?<scope>(?:[^\\.]*)*)\\/)?(?<fileLang>[^./]*)\\.json`),
  serviceInjection: /[^]*(?=(?:private|protected|public)\s+(?<serviceName>[^,:()]+)\s*:\s*(?:TranslocoService\s*(?:,|\))))[^]*/g,
  translationCalls: (serviceName) =>{
    const serviceRgx = serviceName && `|(?:(?:(?:\\s*|this\\.)${sanitizeForRegex(serviceName)})(?:\\s*\\t*\\r*\\n*)*\\.(?:\\s*\\t*\\r*\\n*)*(?:translate|selectTranslate))`;
    return new RegExp(
      `(?:translate${serviceRgx || ''})\\((?![^\`"')+]*(?:\\+|(?:(\`|'|")(?:[^\`'"]*\\1[^+),]*\\+)|(?:(?:[^,]*,){2}[^"'\`+]*\\+))))[^\`"')+]*(?:(?:\`(?!(?:[^$\`]*\\$\\{))(?<backtickKey>[^\`]*?)\`)|(?:('|")(?<key>[^"']*)\\3))([^\`'"){]*)(?:{(?:(?:[^{}])(?:{[^}]*?})?)*}\\s*(?:,[^\`'")]*(?:(?:\`(?!(?:[^$\`]*\\$\\{))(?<backtickScope>[^\`]*)\`)|(?:("|')(?<scope>[^"']*)\\7)))?)?\\)`,
      'g'
    )
  },
  /** use the translate function directly */
  directImport: /import\s*{\s*[^}]*translate[^}]*}\s*from\s*("|')@ngneat\/transloco\1/g,
};

module.exports = { regexs };
