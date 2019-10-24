import {Config} from "./types";

let config: Config = {};

export function setConfig(_config: Config) {
    config = _config;
}

export function getConfig(): Config {
    return config;
}