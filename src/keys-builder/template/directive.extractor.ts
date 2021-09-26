import {
  AST,
  ASTWithSource,
  TmplAstBoundAttribute,
  TmplAstNode,
  TmplAstTextAttribute,
} from '@angular/compiler';

import { ExtractorConfig } from '../../types';
import { addKey } from '../add-key';
import { resolveAliasAndKey } from '../utils/resolvers.utils';

import { TemplateExtractorConfig } from './types';
import {
  isBoundAttribute,
  isConditionalExpression,
  isElement,
  isInterpolation,
  isLiteralExpression,
  isSupportedNode,
  isTemplate,
  isTextAttribute,
  parseTemplate,
} from './utils';

export function directiveExtractor(config: TemplateExtractorConfig) {
  const ast = parseTemplate(config);
  traverse(ast.nodes, config);
}

function traverse(nodes: TmplAstNode[], config: ExtractorConfig) {
  for (const node of nodes) {
    if (!isSupportedNode(node, [isTemplate, isElement])) {
      continue;
    }

    const astTrees = [...node.inputs, ...node.attributes]
      .filter(isTranslocoDirective)
      .map((ast) => {
        let value = ast.value;
        if (value instanceof ASTWithSource) {
          value = value.ast;
        }

        return isInterpolation(value) ? (value.expressions as AST[]) : value;
      })
      .flat();
    traverse(node.children, config);
    addKeysFromAst(astTrees, config);
  }
}

function isTranslocoDirective(
  ast: unknown
): ast is TmplAstBoundAttribute | TmplAstTextAttribute {
  return (
    (isBoundAttribute(ast) || isTextAttribute(ast)) && ast.name === 'transloco'
  );
}

function addKeysFromAst(
  expressions: Array<string | AST>,
  config: ExtractorConfig
): void {
  for (const exp of expressions) {
    const isString = typeof exp === 'string';
    if (isConditionalExpression(exp)) {
      addKeysFromAst([exp.trueExp, exp.falseExp], config);
    } else if (isLiteralExpression(exp) || isString) {
      const [key, scopeAlias] = resolveAliasAndKey(
        isString ? exp : exp.value,
        config.scopes
      );
      addKey({
        ...config,
        keyWithoutScope: key,
        scopeAlias,
      });
    }
  }
}
