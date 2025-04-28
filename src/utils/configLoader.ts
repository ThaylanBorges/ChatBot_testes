import fs from "fs";

export class ConfigSingleton {
  private static config: any;

  private constructor() {}

  static getConfig(): any {
    if (!ConfigSingleton.config) {
      try {
        const rawData = fs.readFileSync("./src/config/config.json", "utf-8");
        ConfigSingleton.config = JSON.parse(rawData);
      } catch (error: any) {
        throw {
          status: "500",
          message: `Erro ao carregar configurações: ${error.message}`,
        };
      }
    }
    return ConfigSingleton.config;
  }
}
