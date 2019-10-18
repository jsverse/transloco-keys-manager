export function initExtraction(input: string) {
  return { src: `${process.cwd()}/${input}`, scopeToKeys: { __global: {} }, fileCount: 0 };
}
