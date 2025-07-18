import {
  Call,
  Interpolation,
  LiteralMap,
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
  TmplAstSwitchBlockCase,
  TmplAstTemplate,
  TmplAstTextAttribute
} from '@angular/compiler';

import { readFile } from '../../utils/file.utils';

import { TemplateExtractorConfig } from './types';
import { isLiteralMap } from '@jsverse/angular-utils';

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
  | TmplAstSwitchBlockCase
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
    node instanceof TmplAstSwitchBlockCase
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
    return node.cases;
  }

  return node.children;
}

export function resolveKeysFromLiteralMap(node: LiteralMap): string[] {
  let keys: string[] = [];

  for (let i = 0; i < node.values.length; i++) {
    const { key } = node.keys[i];
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
