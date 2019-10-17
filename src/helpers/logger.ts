import * as ora from 'ora';

let spinner;

const defaultLogger = {
  log: (...msg) => console.log(...msg),
  success: msg => spinner.succeed(msg),
  startSpinner: msg => (spinner = ora().start(msg))
};

export function getLogger() {
  return defaultLogger;
}
