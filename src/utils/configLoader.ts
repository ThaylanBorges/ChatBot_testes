import { loadConfig } from "../utils/configParser";

const config = loadConfig("./.config");

export function getConfig() {
  return config;
}
