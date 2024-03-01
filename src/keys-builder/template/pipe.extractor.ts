import { AST, ASTWithSource, TmplAstNode } from '@angular/compiler';

import { DefaultLanguageValue, ExtractorConfig } from '../../types';
import { addKey } from '../add-key';
import { resolveAliasAndKey } from '../utils/resolvers.utils';

import { TemplateExtractorConfig } from './types';
import {
  extractDefaultFromPipeExp,
  isBinaryExpression,
  isBindingPipe,
  isBoundText,
  isConditionalExpression,
  isElement,
  isInterpolation,
  isLiteralExpression,
  isLiteralMap,
  isMethodCall,
  isTemplate,
  parseTemplate,
} from './utils';

export function pipeExtractor(config: TemplateExtractorConfig) {
  const ast = parseTemplate(config);
  traverse(ast.nodes, config);
}

function traverse(nodes: TmplAstNode[], config: ExtractorConfig) {
  for (const node of nodes) {
    let astTrees: AST[] = [];

    if (isElement(node) || isTemplate(node)) {
      astTrees = node.inputs.map((input) => (input.value as ASTWithSource).ast);
      traverse(node.children, config);
    } else if (isBoundText(node)) {
      astTrees = [(node.value as ASTWithSource).ast];
    }

    for (const ast of astTrees) {
      const res = getPipeValuesFromAst(ast, config.defaultPipeArgument);
      if (res) {
        if (res.defaultValue) {
          config.defaults.push(res.defaultValue);
        }

        addKeysFromAst(res ? res.ast : null, config);
      }
    }
  }
}

function isTranslocoPipe(ast: any) {
  const isPipeChaining = isBindingPipe(ast.exp);
  const isTransloco =
    ast.name === 'transloco' &&
    (isPipeChaining ||
      isLiteralExpression(ast.exp) ||
      isConditionalExpression(ast.exp));

  return isTransloco || (isPipeChaining && isTranslocoPipe(ast.exp));
}

function getPipeValuesFromAst(
  ast: AST,
  defaultPipeArgument?: string
): {
  ast: AST[];
  defaultValue: DefaultLanguageValue;
} {
  let exp = [];
  if (isBindingPipe(ast) && isTranslocoPipe(ast)) {
    let dValue: DefaultLanguageValue;
    if (isLiteralExpression(ast.exp)) {
      for (let arg of ast.args) {
        const key = ast.exp.value;
        if (key == 'label.authentication.partnerPortal.title') {
        }
        const defaultIndex = arg.keys.findIndex(
          (k) =>
            k.key.toLowerCase() == (defaultPipeArgument ?? '').toLowerCase()
        );
        if (defaultIndex != -1) {
          dValue = {
            key: key,
            value: extractDefaultFromPipeExp(arg.values[defaultIndex]),
          };
        }
      }
      return {
        ast: [ast.exp],
        defaultValue: dValue,
      };
    } else if (isConditionalExpression(ast.exp)) {
      return {
        ast: [ast.exp.trueExp, ast.exp.falseExp],
        defaultValue: dValue,
      };
    } else {
      let pipe = ast;
      while (isBindingPipe(pipe.exp)) {
        pipe = pipe.exp;
      }

      return {
        ast: [pipe.exp],
        defaultValue: dValue,
      };
    }
  } else if (isBindingPipe(ast)) {
    exp = [...ast.args, ast.exp];
  } else if (isLiteralMap(ast)) {
    exp = ast.values;
  } else if (isInterpolation(ast)) {
    exp = ast.expressions;
  } else if (isConditionalExpression(ast)) {
    exp = [ast.condition, ast.trueExp, ast.falseExp];
  } else if (isBinaryExpression(ast)) {
    exp = [ast.left, ast.right];
  } else if (isMethodCall(ast)) {
    exp = [...ast.args, ast.receiver];
  }

  const expValue = exp
    .map((ast) => getPipeValuesFromAst(ast, defaultPipeArgument))
    .flat();
  const asts = expValue.map((x) => x.ast).flat();
  const defaultValues = expValue.map((x) => x.defaultValue).flat();
  const res = { ast: asts, defaultValue: defaultValues.find((x) => x) };

  return res;
}

function addKeysFromAst(expressions: AST[], config: ExtractorConfig): void {
  for (const exp of expressions) {
    if (isConditionalExpression(exp)) {
      addKeysFromAst([exp.trueExp, exp.falseExp], config);
    } else if (isLiteralExpression(exp)) {
      const [key, scopeAlias] = resolveAliasAndKey(exp.value, config.scopes);
      addKey({
        ...config,
        keyWithoutScope: key,
        scopeAlias,
      });
    }
  }
}
