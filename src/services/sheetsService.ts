import { AuthSingleton } from "../utils/clientGoogle";

export class SheetsService {
  static async getSpreadsheetData(
    spreadsheetId: string,
    page: any,
    columns: any
  ) {
    const sheets = AuthSingleton.getSheetsClient();

    const { inicio, fim, campos } = columns;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${page}!${inicio}:${fim}`,
    });

    const values = response.data.values ?? [];

    return response.data.values!.map((row: any) => {
      const result: any = {};

      Object.keys(campos).forEach((key, index) => {
        let value = row[index];

        result[key] = value;
      });

      return result;
    });
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
}
