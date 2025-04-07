import { google } from "googleapis";
import { AuthSingleton } from "../utils/clientGoogle";

export class SheetsService {
  static async getSpreadsheetData(spreadsheetId: string) {
    const auth = AuthSingleton.getInstance();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A1:Z",
    });

    return response.data.values;
  }

  static async addDataSheets(
    spreadsheetId: string,
    dynamicRange: string,
    values: any[][]
  ) {
    const auth = AuthSingleton.getInstance();
    const sheets = google.sheets({ version: "v4", auth });

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

  static async sumValues(spreadsheetId: string) {
    const auth = AuthSingleton.getInstance();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A:A",
    });

    const values = response.data.values || [];
    const sum = values.reduce((total, row) => {
      const value = parseFloat(row[0]);
      return total + (isNaN(value) ? 0 : value);
    }, 0);
    return sum;
  }

  static async dynamicRange(spreadsheetId: string, page: any) {
    const auth = AuthSingleton.getInstance();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${page.nome}!A:A`,
    });

    const nextRow = response.data.values ? response.data.values.length + 1 : 2;

    return `${page.nome}!${page.coluna_inicio}${nextRow}:${page.coluna_inicio}${nextRow}`;
  }
}
