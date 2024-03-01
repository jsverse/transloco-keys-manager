import {
  Binary,
  BindingPipe,
  Conditional,
  Interpolation,
  LiteralMap,
  LiteralPrimitive,
  MethodCall,
  parseTemplate as ngParseTemplate,
  ParseTemplateOptions,
  TmplAstBoundAttribute,
  TmplAstBoundText,
  TmplAstElement,
  TmplAstTemplate,
  TmplAstTextAttribute,
} from '@angular/compiler';

import { readFile } from '../../utils/file.utils';

import { TemplateExtractorConfig } from './types';

export function isTemplate(node: unknown): node is TmplAstTemplate {
  return node instanceof TmplAstTemplate;
}

export function isElement(node: unknown): node is TmplAstElement {
  return node instanceof TmplAstElement;
}

export function isBoundText(node: unknown): node is TmplAstBoundText {
  return node instanceof TmplAstBoundText;
}

export function isBoundAttribute(node: unknown): node is TmplAstBoundAttribute {
  return node instanceof TmplAstBoundAttribute;
}

export function isTextAttribute(node: unknown): node is TmplAstTextAttribute {
  return node instanceof TmplAstTextAttribute;
}

export function isBindingPipe(ast: unknown): ast is BindingPipe {
  return ast instanceof BindingPipe;
}

export function isInterpolation(ast: unknown): ast is Interpolation {
  return ast instanceof Interpolation;
}

export function isMethodCall(ast: unknown): ast is MethodCall {
  return ast instanceof MethodCall;
}

export function isNgTemplateTag(node: TmplAstTemplate) {
  return node.tagName === 'ng-template';
}

export function isLiteralExpression(
  expression: unknown
): expression is LiteralPrimitive {
  return expression instanceof LiteralPrimitive;
}

export function isLiteralMap(expression: unknown): expression is LiteralMap {
  return expression instanceof LiteralMap;
}

export function isConditionalExpression(
  expression: unknown
): expression is Conditional {
  return expression instanceof Conditional;
}

export function isBinaryExpression(expression: unknown): expression is Binary {
  return expression instanceof Binary;
}

export function parseTemplate(
  config: TemplateExtractorConfig,
  options?: ParseTemplateOptions
) {
  const { file, content } = config;
  const resolvedContent = content || readFile(file);

  return ngParseTemplate(resolvedContent, file, options);
}

type GuardedType<T> = T extends (x: any) => x is infer U ? U : never;

export function isSupportedNode<Predicates extends any[]>(
  node: unknown,
  predicates: Predicates
): node is GuardedType<Predicates[number]> {
  return predicates.some((predicate) => predicate(node));
}

export function extractDefaultFromPipeExp(obj): string {
  return Object.keys(obj).includes('exp')
    ? extractDefaultFromPipeExp(obj['exp'])
    : obj.value;
}
