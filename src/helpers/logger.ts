import * as ora from 'ora';

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
