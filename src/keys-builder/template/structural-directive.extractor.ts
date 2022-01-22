import {
  AST,
  ASTWithSource,
  Interpolation,
  MethodCall,
  RecursiveAstVisitor,
  TmplAstNode,
  TmplAstTemplate,
  TmplAstTextAttribute,
} from '@angular/compiler';

import { ExtractorConfig } from '../../types';
import { addKey } from '../add-key';
import { resolveAliasAndKey } from '../utils/resolvers.utils';

import { TemplateExtractorConfig } from './types';
import {
  isBoundAttribute,
  isBoundText,
  isConditionalExpression,
  isElement,
  isInterpolation,
  isLiteralExpression,
  isMethodCall,
  isNgTemplateTag,
  isSupportedNode,
  isTemplate,
  parseTemplate,
} from './utils';

interface ContainerMetaData {
  exp?: AST;
  name: string;
  read?: string;
  /* We need to keep the element's span since we might have several method declarations with the same name */
  spanOffset: { start: number; end: number };
}

export function structuralDirectiveExtractor(config: TemplateExtractorConfig) {
  const ast = parseTemplate(config);
  traverse(ast.nodes, [], config);
}

export function traverse(
  nodes: TmplAstNode[],
  containers: ContainerMetaData[],
  config: TemplateExtractorConfig
) {
  for (const node of nodes) {
    let methodUsages: ContainerMetaData[] = [];

    if (isBoundText(node)) {
      const { expressions } = (node.value as ASTWithSource)
        .ast as Interpolation;
      methodUsages = getMethodUsages(expressions, containers);
    } else if (isSupportedNode(node, [isTemplate, isElement])) {
      if (isTranslocoTemplate(node)) {
        for (const metadata of resolveMetadata(node)) {
          containers.push(metadata);
        }
      }

      let attrsSource = node.inputs;
      if (isTemplate(node)) {
        attrsSource = node.inputs.concat(
          node.templateAttrs.filter(isBoundAttribute)
        );
      }

      const boundAttrs = attrsSource
        .map((input) => {
          const { ast } = input.value as ASTWithSource;

          return isInterpolation(ast) ? ast.expressions : ast;
        })
        .flat();

      methodUsages = getMethodUsages(boundAttrs, containers);
      traverse(node.children, containers, config);
    }

    addKeysFromAst(methodUsages, config);
  }
}

class MethodCallUnwrapper extends RecursiveAstVisitor {
  expressions: MethodCall[] = [];

  override visitMethodCall(method: MethodCall, context: any) {
    this.expressions.push(method);
    super.visitMethodCall(method, context);
  }
}

/**
 * Extract method calls from an AST.
 */
function unwrapMethodCalls(exp: AST): MethodCall[] {
  const unwrapper = new MethodCallUnwrapper();
  unwrapper.visit(exp);
  return unwrapper.expressions;
}

function getMethodUsages(
  expressions: AST[],
  containers: ContainerMetaData[]
): ContainerMetaData[] {
  return expressions
    .flatMap(unwrapMethodCalls)
    .filter((exp) => isTranslocoMethod(exp, containers))
    .map((exp: MethodCall) => {
      return {
        exp: exp.args[0],
        ...containers.find(({ name, spanOffset: { start, end } }) => {
          const inRange =
            exp.sourceSpan.end < end && exp.sourceSpan.start > start;

          return exp.name === name && inRange;
        }),
      };
    });
}

function isTranslocoAttr(attr: TmplAstTextAttribute) {
  return attr.name === 'transloco';
}

function isReadAttr<T extends { name: string }>(attr: T) {
  return attr.name === 'translocoRead';
}

function isTranslocoTemplate(node: TmplAstNode): node is TmplAstTemplate {
  return (
    isTemplate(node) &&
    (node.templateAttrs.some(isTranslocoAttr) ||
      (isNgTemplateTag(node) && node.attributes.some(isTranslocoAttr)))
  );
}

function isTranslocoMethod(
  exp: AST,
  containers: ContainerMetaData[]
): exp is MethodCall {
  return isMethodCall(exp) && containers.some(({ name }) => name === exp.name);
}

function resolveMetadata(node: TmplAstTemplate): ContainerMetaData[] {
  /*
   * An ngTemplate element might have more then once implicit variables, we need to capture all of them.
   * */
  let metadata: Omit<ContainerMetaData, 'spanOffset' | 'exp'>[];
  if (isNgTemplateTag(node)) {
    const implicitVars = node.variables.filter((attr) => !attr.value);
    let read = node.attributes.find(isReadAttr)?.value;
    if (!read) {
      const ast = (node.inputs.find(isReadAttr)?.value as ASTWithSource)?.ast;
      if (isLiteralExpression(ast)) {
        read = ast.value;
      }
    }

    metadata = implicitVars.map(({ name }) => ({ name, read }));
  } else {
    const { name } = node.variables.find(
      (variable) => variable.value === '$implicit'
    )!;
    const read = node.templateAttrs.find(isReadAttr)?.value as ASTWithSource;
    metadata = isLiteralExpression(read?.ast)
      ? [{ name, read: read.ast.value }]
      : [{ name }];
  }

  return metadata.map((metadata) => {
    const sourceSpan = node.sourceSpan;

    return {
      ...metadata,
      spanOffset: {
        start: sourceSpan.start.offset,
        end: sourceSpan.end.offset,
      },
    };
  });
}

function addKeysFromAst(
  expressions: Array<Pick<ContainerMetaData, 'exp' | 'read'>>,
  config: ExtractorConfig
): void {
  for (const { exp, read } of expressions) {
    if (isConditionalExpression(exp)) {
      for (const conditionValue of [exp.trueExp, exp.falseExp]) {
        addKeysFromAst([{ exp: conditionValue, read }], config);
      }
    } else if (isLiteralExpression(exp) && exp.value) {
      let value = read ? `${read}.${exp.value}` : exp.value;
      const [key, scopeAlias] = resolveAliasAndKey(value, config.scopes);
      addKey({
        ...config,
        keyWithoutScope: key,
        scopeAlias,
      });
    }
  }
}
