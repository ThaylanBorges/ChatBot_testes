import { AuthSingleton } from "./clientGoogle";

export class SpreadsheetHelper {
  static async getRange(
    spreadsheetId: string,
    aba: string,
    columns: any,
    firstColumm: any,
    lastColumm: any
  ) {
    const sheets = AuthSingleton.getSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${aba}!${columns.inicio}:${columns.fim}`,
    });

    const match = columns.inicio.match(/\d+/);
    const row = response.data.values || [];
    const lastRow = row.length + parseInt(match[0]);

    return `${aba}!${firstColumm}${lastRow}:${lastColumm}${lastRow}`;
  }

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
}
