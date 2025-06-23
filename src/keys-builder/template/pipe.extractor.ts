import {
  AST,
  BindingPipe,
  LiteralPrimitive,
  tmplAstVisitAll,
} from '@angular/compiler';

import { ExtractorConfig, OrArray } from '../../types';
import { addKey } from '../add-key';
import { resolveAliasAndKey } from '../utils/resolvers.utils';

import { TemplateExtractorConfig } from './types';
import { parseTemplate, resolveKeysFromLiteralMap } from './utils';
import { notNil } from '../../utils/validators.utils';
import { coerceArray } from '../../utils/collection.utils';

import {
  AstPipeCollector,
  isBindingPipe,
  isConditionalExpression,
  isLiteralExpression,
  isLiteralMap,
  TmplPipeCollector,
} from '@jsverse/utils';

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

function resolveKeyNode(ast: OrArray<AST>): LiteralPrimitive[] {
  return coerceArray(ast)
    .flatMap((expression) => {
      if (isLiteralExpression(expression)) {
        return expression;
      } else if (isConditionalExpression(expression)) {
        return resolveKeyNode([expression.trueExp, expression.falseExp]);
        // TODO: Temporary check for backward compatibility between v19 and v20.
        // In the future (major version), prefer:
        // else if (expression instanceof ParenthesizedExpression) {
        //   return resolveKeyNode(expression.expression);
        // }
        // Consider this refactor for the next major version.
      } else if (expression.constructor.name === 'ParenthesizedExpression') {
        return resolveKeyNode((expression as any).expression);
      }
      return undefined;
    })
    .filter(notNil);
}

function resolveKeyAndParam(
  pipe: BindingPipe,
  paramsNode?: AST,
): KeyWithParam | KeyWithParam[] | null {
  const resolvedParams: AST = paramsNode ?? pipe.args[0];
  if (isBindingPipe(pipe.exp)) {
    let nestedPipe = pipe;
    while (isBindingPipe(nestedPipe.exp)) {
      nestedPipe = nestedPipe.exp;
    }

    return resolveKeyAndParam(nestedPipe, resolvedParams);
  } else {
    const keyNodes = resolveKeyNode(pipe.exp);
    if (keyNodes.length >= 1) {
      return keyNodes.map((keyNode) => ({
        keyNode,
        paramsNode: resolvedParams,
      }));
    }
  }

  return null;
}

function addKeysFromAst(keys: KeyWithParam[], config: ExtractorConfig): void {
  for (const { keyNode, paramsNode } of keys) {
    const [key, scopeAlias] = resolveAliasAndKey(keyNode.value, config.scopes);
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
