export function initExtraction(input = '') {
  return { src: `${process.cwd()}/${input}`, scopeToKeys: { __global: {} }, fileCount: 0 };
}
