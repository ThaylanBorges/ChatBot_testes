export class SpreadsheetHelper {
  static extractRowNumber(cellRange: string) {
    if (!cellRange || typeof cellRange !== "string") {
      throw { status: "500", message: `Entrada inválida: ${cellRange}` };
    }

    const match = cellRange.match(/\d+/);

    if (match && match.length > 0) {
      return parseInt(match[0]);
    }

    throw {
      status: "500",
      message: `Nenhum número encontrado na célula: "${cellRange}". Verifique se o formato está correto.`,
    };
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

  static getCategoryConfig(type: string, config: any) {
    const category = config.planilha.categorias[type];
    if (!category)
      throw { status: 400, message: `Categoria "${type}" não encontrada` };
    return category;
  }
}
