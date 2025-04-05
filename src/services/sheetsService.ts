import { google } from "googleapis";
import { AuthSingleton } from "../utils/clientGoogle";

export class SheetsService {
  static async getNextAvailableRow(spreadsheetId: string) {
    const auth = AuthSingleton.getInstance();
    const sheets = google.sheets({ version: "v4", auth: auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A1:A",
    });

    const lastRow = response.data.values ? response.data.values.length + 1 : 1;
    return lastRow;
  }

  static async getSpreadsheetData(spreadsheetId: string) {
    const auth = AuthSingleton.getInstance();
    const sheets = google.sheets({ version: "v4", auth: auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A1:Z",
    });

    return response.data.values;
  }

  static async addDataSheets(spreadsheetId: string, values: any[][]) {
    const auth = AuthSingleton.getInstance();
    const sheets = google.sheets({ version: "v4", auth: auth });
    const nextRow = await this.getNextAvailableRow(spreadsheetId);
    const finalRow = nextRow + values.length - 1;

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `A${nextRow}:Z${finalRow}`,
      valueInputOption: "RAW",
      requestBody: {
        values: values,
      },
    });

    return response.data;
  }
}
