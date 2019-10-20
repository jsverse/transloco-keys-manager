import { regexs } from '../regexs';
import { TEMPLATE_TYPE } from '../types';

/** Get the keys from an ngTemplate/ngContainer */
export function getStructuralDirectiveBasedKeys(element, templateType: TEMPLATE_TYPE, matchedStr: string) {
  let translationKeys = [],
    read,
    readSearch,
    varName;

  if(templateType === TEMPLATE_TYPE.STRUCTURAL) {
    const data = element.attribs.__transloco;
    readSearch = data.match(/read:\s*('|")(?<read>[^"']*)\1/);
    read = readSearch && readSearch.groups.read;
    varName = data.match(/let\s+(?<varName>\w*)/).groups.varName;
  } else {
    const attrs = Object.keys(element.attribs);
    varName = (attrs.find(attr => attr.includes('let-')) || '').replace('let-', '');
    readSearch = attrs.find(attr => attr === 'translocoread' || attr === '[translocoread]');
    read = readSearch && element.attribs[readSearch].replace(/'|"/g, '');
  }

  if(varName) {
    const keyRegex = regexs.templateKey(varName);
    let keySearch = keyRegex.exec(matchedStr);

    while(keySearch) {
      translationKeys.push(keySearch.groups.key);
      keySearch = keyRegex.exec(matchedStr);
    }
  }

  return { translationKeys, read, varName };
}
