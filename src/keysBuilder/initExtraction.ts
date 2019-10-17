export function initExtraction(input: string) {
  return { src: `${process.cwd()}/${input}`, keys: { __global: {} }, fileCount: 0 };
}
