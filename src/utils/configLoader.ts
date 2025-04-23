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
        throw new Error(`Erro ao carregar configurações: ${error.message}`);
      }
    }
    return ConfigSingleton.config;
  }

  static getColuns(type: string) {
    const config = this.getConfig();
    return config.planilha.categorias[type]?.colunas || null;
  }

  static getMonthTabName(date: Date = new Date()) {
    const month = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    return month[date.getMonth()];
  }

  static extractRowNumber(cellRange: string) {
    const match = cellRange.match(/\d+/);
    if (match) return parseInt(match[0]);
    throw {
      status: 500,
      message: "Não foi possível extrair o número da célula: " + cellRange,
    };
  }
}
