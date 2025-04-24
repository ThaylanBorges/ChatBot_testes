import { SheetsService } from "../services/sheetsService";
import { AuthSingleton } from "./clientGoogle";
import { ConfigSingleton } from "./configLoader";

export class Teste {
  static async updateStudent(
    spreadsheetId: string,
    aba: string,
    columns: any,
    payer: string,
    service: string,
    value: number,
    paymentType: string,
    planType: string,
    dueDate: string
  ) {
    const rows = await SheetsService.getSpreadsheetData(
      spreadsheetId,
      aba,
      columns
    );

    if (!rows || rows.length === 0) {
      throw new Error("Nenhum dado encontrado na planilha");
    }

    const gastosServico = rows.findIndex((row: any) => row[0] === payer);
    if (gastosServico === -1) {
      throw new Error("Pagador não encontrado na planilha");
    }

    const startingRow = ConfigSingleton.extractRowNumber(columns.inicio);
    const actualRow = startingRow + gastosServico;

    const updates = [
      {
        range: `${aba}!${columns.campos.servico}${actualRow}`,
        values: [[service]],
      },
      {
        range: `${aba}!${columns.campos.valor}${actualRow}`,
        values: [[value]],
      },
      {
        range: `${aba}!${columns.campos.tipoPagamento}${actualRow}`,
        values: [[paymentType]],
      },
      {
        range: `${aba}!${columns.campos.tipoPlano}${actualRow}`,
        values: [[planType]],
      },
      {
        range: `${aba}!${columns.campos.dataVencimento}${actualRow}`,
        values: [[dueDate]],
      },
    ];

    await SheetsService.batchUpdateCells(spreadsheetId, updates);
  }

  static async updateExpenses(
    spreadsheetId: string,
    aba: string,
    columns: any,
    serviceExpenses: string,
    value: number,
    status: string
  ) {
    const rows = await SheetsService.getSpreadsheetData(
      spreadsheetId,
      aba,
      columns
    );

    if (!rows || rows.length === 0) {
      throw new Error("Nenhum dado encontrado na planilha");
    }

    const gastosServico = rows.findIndex(
      (row: any) => row[0] === serviceExpenses
    );

    if (gastosServico === -1) {
      throw new Error("Serviço não encontrado na planilha");
    }

    const startingRow = ConfigSingleton.extractRowNumber(columns.inicio);
    const actualRow = startingRow + gastosServico;

    const updates = [
      {
        range: `${aba}!${columns.campos.valores}${actualRow}`,
        values: [[value]],
      },
      {
        range: `${aba}!${columns.campos.status}${actualRow}`,
        values: [[status]],
      },
    ];

    await SheetsService.batchUpdateCells(spreadsheetId, updates);
  }

  static async addStudent(
    spreadsheetId: string,
    aba: string,
    columns: any,
    payer: string,
    service: string,
    value: number,
    paymentType: string,
    planType: string,
    dueDate: string
  ) {
    const valuesToAppend = [
      [payer, service, value, paymentType, planType, dueDate],
    ];
    await this.addDataToSheet(spreadsheetId, aba, columns, valuesToAppend);
  }

  static async addExpenses(
    spreadsheetId: string,
    aba: string,
    columns: any,
    gastoServicos: string,
    valor: number,
    status: string
  ) {
    const valuesToAppend = [[gastoServicos, valor, status]];
    await this.addDataToSheet(spreadsheetId, aba, columns, valuesToAppend);
  }

  static async addDataToSheet(
    spreadsheetId: string,
    aba: string,
    columns: any,
    values: any[]
  ) {
    const range = await this.getRange(
      spreadsheetId,
      aba,
      columns,
      Object.values(columns.campos)[0], // Primeira coluna da configuração
      Object.values(columns.campos).slice(-1)[0] // Última coluna da configuração
    );

    await SheetsService.addDataSheets(spreadsheetId, values, range);
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
