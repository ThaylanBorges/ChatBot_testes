import { AuthSingleton } from "../utils/clientGoogle";

export class SheetsService {
  static async getSpreadsheetData(
    spreadsheetId: string,
    page: any,
    columns: any
  ) {
    const sheets = AuthSingleton.getSheetsClient();

    const { inicio, fim, campos } = columns;

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${page}!${inicio}:${fim}`,
      });

      if (!response.data.values || response.data.values.length === 0) {
        throw { status: 400, message: "Categoria sem dados." };
      }

      const data = response.data.values.map((row: any) => {
        const result: any = {};

        Object.keys(campos).forEach((key, index) => {
          let value = row[index];

          result[key] = value;
        });

        return result;
      });

      console.log(data);

      return data;
    } catch (error: any) {
      if (error.message.includes("Unable to parse range")) {
        throw {
          status: 404,
          message: `A aba "${page}" não foi encontrada na planilha.`,
        };
      }
      throw error;
    }
  }

  static async addDataSheets(spreadsheetId: string, values: any, range: any) {
    const sheets = AuthSingleton.getSheetsClient();

    const request = {
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    };

    const response = await sheets.spreadsheets.values.append(request);

    return response.data;
  }

  static async batchUpdateCells(
    spreadsheetId: string,
    updates: { range: string; values: any[][] }[]
  ) {
    const sheets = AuthSingleton.getSheetsClient();
    const request = {
      valueInputOption: "USER_ENTERED",
      data: updates,
    };

    const response = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: request,
    });

    return response.data;
  }

  static async getRange(
    spreadsheetId: string,
    page: string,
    columns: any,
    firstColumn: any,
    lastColumn: any
  ) {
    const sheets = AuthSingleton.getSheetsClient();

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${page}!${columns.inicio}:${columns.fim}`,
      });

      const match = columns.inicio.match(/\d+/);
      const row = response.data.values || [];
      const lastRow = row.length + parseInt(match[0]);

      return `${page}!${firstColumn}${lastRow}:${lastColumn}${lastRow}`;
    } catch (error: any) {
      if (error.message.includes("Unable to parse range")) {
        throw {
          status: 404,
          message: `A aba "${page}" não foi encontrada na planilha.`,
        };
      }
      throw error;
    }
  }
}
