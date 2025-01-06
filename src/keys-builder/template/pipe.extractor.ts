import {
  AST,
  BindingPipe,
  LiteralPrimitive,
  tmplAstVisitAll,
} from '@angular/compiler';

import { ExtractorConfig } from '../../types';
import { addKey } from '../add-key';
import { resolveAliasAndKey } from '../utils/resolvers.utils';

import { TemplateExtractorConfig } from './types';
import { parseTemplate, resolveKeysFromLiteralMap } from './utils';
import { notNil } from '../../utils/validators.utils';
import {
  AstPipeCollector,
  isBindingPipe,
  isConditionalExpression,
  isLiteralExpression,
  isLiteralMap,
  TmplPipeCollector,
} from '@jsverse/utils';
import { Defaults } from '../../utils/defaults';

export function pipeExtractor(config: TemplateExtractorConfig) {
  const parsedTemplate = parseTemplate(config);
  const tmplVisitor = new TmplPipeCollector('transloco');
  tmplAstVisitAll(tmplVisitor, parsedTemplate.nodes);
  const astVisitor = new AstPipeCollector();
  astVisitor.visitAll([...tmplVisitor.astTrees], {});
  const keysWithParams = astVisitor.pipes
    .get('transloco')
    ?.map((p) => resolveKeyAndParam(p.node))
    .flat()
    .filter(notNil);
  if (keysWithParams) {
    addKeysFromAst(keysWithParams, config);
  }
}

interface KeyWithParam {
  keyNode: LiteralPrimitive;
  paramsNode: AST;
}

function resolveKeyAndParam(
  pipe: BindingPipe,
  paramsNode?: AST,
): KeyWithParam | KeyWithParam[] | null {
  const resolvedParams: AST = paramsNode ?? pipe.args[0];
  if (isConditionalExpression(pipe.exp)) {
    return [pipe.exp.trueExp, pipe.exp.falseExp]
      .filter(isLiteralExpression)
      .map((keyNode) => {
        return {
          keyNode,
          paramsNode: resolvedParams,
        };
      });
  } else if (isLiteralExpression(pipe.exp)) {
    return {
      keyNode: pipe.exp,
      paramsNode: resolvedParams,
    };
  } else if (isBindingPipe(pipe.exp)) {
    let nestedPipe = pipe;
    while (isBindingPipe(nestedPipe.exp)) {
      nestedPipe = nestedPipe.exp;
    }

    return resolveKeyAndParam(nestedPipe, resolvedParams);
  }

  return null;
}

function addKeysFromAst(keys: KeyWithParam[], config: ExtractorConfig): void {
  for (const { keyNode, paramsNode } of keys) {
    const [key, scopeAlias] = resolveAliasAndKey(keyNode.value, config.scopes);
    Defaults.pipeExtractorDefaults(paramsNode, key);
    const params = isLiteralMap(paramsNode)
      ? resolveKeysFromLiteralMap(paramsNode)
      : [];

    addKey({
      ...config,
      keyWithoutScope: key,
      scopeAlias,
      params,
    });
  }
}
