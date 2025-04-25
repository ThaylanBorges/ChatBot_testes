import { SheetsService } from "../services/sheetsService";
import { AuthSingleton } from "./clientGoogle";
import { ConfigSingleton } from "./configLoader";

export class SpreadsheetHelper {
  static async updateData(
    spreadsheetId: string,
    aba: string,
    columns: any,
    searchValue: string,
    updateFields: { [key: string]: any }
  ) {
    const rows = await SheetsService.getSpreadsheetData(
      spreadsheetId,
      aba,
      columns
    );

    if (!rows || rows.length === 0) {
      throw new Error("Nenhum dado encontrado na planilha.");
    }

    const rowIndex = rows.findIndex(
      (row: any) => row[0] && row[0] === searchValue
    );

    if (rowIndex === -1) {
      throw new Error("Registro não encontrado na planilha.");
    }

    const startingRow = ConfigSingleton.extractRowNumber(columns.inicio);
    const actualRow = startingRow + rowIndex;

    const updates = Object.keys(updateFields).map((field) => ({
      range: `${aba}!${columns.campos[field]}${actualRow}`,
      values: [[updateFields[field]]],
    }));

    await SheetsService.batchUpdateCells(spreadsheetId, updates);
  }

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
}
