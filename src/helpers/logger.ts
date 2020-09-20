import debug from 'debug';
import ora from 'ora';

let spinner;

function noop() {}

const isProd = process.env.PRODUCTION;
const defaultLogger = {
  log: (...msg) => (isProd ? noop : console.log(...msg)),
  success: msg => (isProd ? noop : spinner.succeed(msg)),
  startSpinner: msg => (isProd ? noop : (spinner = ora().start(msg)))
};

export function getLogger() {
  return defaultLogger;
}

type DebugNamespaces = 'config' | 'paths' | 'scopes';

export function devlog(namespace: DebugNamespaces, tag: string, values: Record<string, any>) {
  if (!debug.enabled(namespace)) return;

  console.log(`\n\x1b[4m🐞 DEBUG - ${tag}:\x1b[0m`);
  // To prevent from logging the namespace twice, we set an empty namespace and enable it
  const log = debug('');
  log.enabled = true;

  for (const [variable, value] of Object.entries(values)) {
    log(`${variable}: %O`, value);
  }
}
