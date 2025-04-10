import { AuthSingleton } from "../utils/clientGoogle";

export class SheetsService {
  static async getSpreadsheetData(spreadsheetId: string, page: any) {
    const sheets = AuthSingleton.getSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${page.nome}!A:Z`,
    });

    return response.data.values;
  }

  static async addDataSheets(
    spreadsheetId: string,
    dynamicRange: string,
    values: any[][]
  ) {
    const sheets = AuthSingleton.getSheetsClient();

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: dynamicRange,
      valueInputOption: "RAW",
      requestBody: {
        values: values,
      },
    });

    return response.data;
  }

  static async sumValues(spreadsheetId: string, page: any) {
    const sheets = AuthSingleton.getSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${page.nome}!${page.coluna_soma}:${page.coluna_soma}`,
    });

    const values = response.data.values || [];
    const sum = values.reduce((total, row) => {
      const value = parseFloat(row[0]);
      return total + (isNaN(value) ? 0 : value);
    }, 0);
    return sum;
  }

  static async dynamicRange(spreadsheetId: string, page: any) {
    const sheets = AuthSingleton.getSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${page.nome}!A:A`,
    });

    const nextRow = response.data.values ? response.data.values.length + 1 : 2;

    return `${page.nome}!${page.coluna_inicio}${nextRow}:${page.coluna_inicio}${nextRow}`;
  }
}
