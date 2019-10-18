import * as ora from 'ora';

let spinner;
function noop(){}

const defaultLogger = {
  log: (...msg) => process.env.PRODUCTION ? noop : console.log(...msg),
  success: msg => process.env.PRODUCTION ? noop : spinner.succeed(msg),
  startSpinner: msg => process.env.PRODUCTION ? noop : (spinner = ora().start(msg))
};

export function getLogger() {
  return defaultLogger;
}
