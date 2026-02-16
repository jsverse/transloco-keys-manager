import {
  BindingPipe,
  Call,
  Conditional,
  Interpolation,
  LiteralMap,
  LiteralMapKey,
  LiteralMapPropertyKey,
  LiteralPrimitive,
  parseTemplate as ngParseTemplate,
  ParseTemplateOptions,
  PropertyRead,
  TmplAstBoundAttribute,
  TmplAstBoundText,
  TmplAstDeferredBlock,
  TmplAstDeferredBlockError,
  TmplAstDeferredBlockLoading,
  TmplAstDeferredBlockPlaceholder,
  TmplAstElement,
  TmplAstForLoopBlock,
  TmplAstForLoopBlockEmpty,
  TmplAstIfBlock,
  TmplAstIfBlockBranch,
  TmplAstNode,
  TmplAstSwitchBlock,
  TmplAstSwitchBlockCaseGroup,
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

export function isLiteralMapPropertyKey(key: LiteralMapKey): key is LiteralMapPropertyKey {
  return key.kind === 'property';
}

export function isInterpolation(ast: unknown): ast is Interpolation {
  return ast instanceof Interpolation;
}

export function isCall(ast: unknown): ast is Call {
  return ast instanceof Call;
}

export function isPropertyRead(ast: unknown): ast is PropertyRead {
  return ast instanceof PropertyRead;
}

export function isNgTemplateTag(node: TmplAstTemplate) {
  return node.tagName === 'ng-template';
}

export function parseTemplate(
  config: TemplateExtractorConfig,
  options?: ParseTemplateOptions,
) {
  const { file, content } = config;
  const resolvedContent = content || readFile(file);

  return ngParseTemplate(resolvedContent, file, options);
}

type GuardedType<T> = T extends (x: any) => x is infer U ? U : never;

export function isSupportedNode<Predicates extends any[]>(
  node: unknown,
  predicates: Predicates,
): node is GuardedType<Predicates[number]> {
  return predicates.some((predicate) => predicate(node));
}

type BlockNode =
  | TmplAstDeferredBlockError
  | TmplAstDeferredBlockLoading
  | TmplAstDeferredBlockPlaceholder
  | TmplAstForLoopBlockEmpty
  | TmplAstIfBlockBranch
  | TmplAstSwitchBlockCaseGroup
  | TmplAstForLoopBlock
  | TmplAstDeferredBlock
  | TmplAstIfBlock
  | TmplAstSwitchBlock;

export function isBlockWithChildren(
  node: unknown,
): node is { children: TmplAstNode[] } {
  return (
    node instanceof TmplAstDeferredBlockError ||
    node instanceof TmplAstDeferredBlockLoading ||
    node instanceof TmplAstDeferredBlockPlaceholder ||
    node instanceof TmplAstForLoopBlockEmpty ||
    node instanceof TmplAstIfBlockBranch ||
    node instanceof TmplAstSwitchBlockCaseGroup
  );
}

export function isTmplAstForLoopBlock(
  node: unknown,
): node is TmplAstForLoopBlock {
  return node instanceof TmplAstForLoopBlock;
}

export function isTmplAstDeferredBlock(
  node: unknown,
): node is TmplAstDeferredBlock {
  return node instanceof TmplAstDeferredBlock;
}

export function isTmplAstIfBlock(node: unknown): node is TmplAstIfBlock {
  return node instanceof TmplAstIfBlock;
}

export function isTmplAstSwitchBlock(
  node: unknown,
): node is TmplAstSwitchBlock {
  return node instanceof TmplAstSwitchBlock;
}

export function isTmplAstSwitchBlockCaseGroup(
  node: unknown,
): node is TmplAstSwitchBlockCaseGroup {
  return node instanceof TmplAstSwitchBlockCaseGroup;
}

export function isBlockNode(node: TmplAstNode): node is BlockNode {
  return (
    isTmplAstIfBlock(node) ||
    isTmplAstForLoopBlock(node) ||
    isTmplAstDeferredBlock(node) ||
    isTmplAstSwitchBlock(node) ||
    isBlockWithChildren(node)
  );
}

export function resolveBlockChildNodes(node: BlockNode): TmplAstNode[] {
  if (isTmplAstIfBlock(node)) {
    return node.branches;
  }

  if (isTmplAstForLoopBlock(node)) {
    return node.empty ? [...node.children, node.empty] : node.children;
  }

  if (isTmplAstDeferredBlock(node)) {
    return [
      ...node.children,
      ...([node.loading, node.error, node.placeholder].filter(
        Boolean,
      ) as TmplAstNode[]),
    ];
  }

  if (isTmplAstSwitchBlock(node)) {
    return node.groups;
  }

  if (isTmplAstSwitchBlockCaseGroup(node)) {
    return node.children;
  }

  return node.children;
}

export function isLiteralExpression(ast: unknown): ast is LiteralPrimitive {
  return (ast as any)?.constructor?.name === 'LiteralPrimitive';
}

export function isConditionalExpression(ast: unknown): ast is Conditional {
  return (ast as any)?.constructor?.name === 'Conditional';
}

export function isLiteralMap(ast: unknown): ast is LiteralMap {
  return (ast as any)?.constructor?.name === 'LiteralMap';
}

export function isBindingPipe(ast: unknown): ast is BindingPipe {
  return (ast as any)?.constructor?.name === 'BindingPipe';
}

export function resolveKeysFromLiteralMap(node: LiteralMap): string[] {
  let keys: string[] = [];

  for (let i = 0; i < node.values.length; i++) {
    const { key } = node.keys.filter(isLiteralMapPropertyKey)[i];
    const value = node.values[i];

    if (isLiteralMap(value)) {
      const prefixedKeys = resolveKeysFromLiteralMap(value).map(
        (k) => `${key}.${k}`,
      );
      keys = keys.concat(prefixedKeys);
    } else {
      keys.push(key);
    }
  }

  return keys;
}
