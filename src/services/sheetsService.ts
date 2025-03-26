import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";

function getClient() {
  const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_CREDENTIALS,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
}

export class SheetsService {
  static async getSpreadsheetData(spreadsheetId: string, range: string) {
    const auth = getClient();
    const sheets = google.sheets({ version: "v4", auth: auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values;
  }

  static async addDataSheets(
    spreadsheetId: string,
    range: string,
    values: any[][]
  ) {
    const auth = getClient();
    const sheets = google.sheets({ version: "v4", auth: auth });

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: values,
      },
    });

    return response.data;
  }
}
