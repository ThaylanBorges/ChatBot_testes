import { SheetsService } from "../services/sheetsService";
import { AuthSingleton } from "./clientGoogle";
import { ConfigSingleton } from "./configLoader";

export class Teste {
  static async handleUpdateAluno(
    spreadsheetId: string,
    aba: string,
    columns: any,
    pagador: string,
    servico: string,
    valor: number,
    tipoPagamento: string,
    tipoPlano: string,
    dataVencimento: string
  ) {
    const rows = await SheetsService.getSpreadsheetData(
      spreadsheetId,
      aba,
      columns
    );

    if (!rows || rows.length === 0) {
      throw new Error("Nenhum dado encontrado na planilha");
    }

    const payerRowIndex = rows.findIndex((row: any) => row[0] === pagador);
    if (payerRowIndex === -1) {
      throw new Error("Pagador não encontrado na planilha");
    }

    const startingRow = ConfigSingleton.extractRowNumber(columns.inicio);
    const actualRow = startingRow + payerRowIndex;
    const campos = columns.campos;

    const updates = [
      { range: `${aba}!${campos.servico}${actualRow}`, values: [[servico]] },
      { range: `${aba}!${campos.valor}${actualRow}`, values: [[valor]] },
      {
        range: `${aba}!${campos.tipoPagamento}${actualRow}`,
        values: [[tipoPagamento]],
      },
      {
        range: `${aba}!${campos.tipoPlano}${actualRow}`,
        values: [[tipoPlano]],
      },
      {
        range: `${aba}!${campos.dataVencimento}${actualRow}`,
        values: [[dataVencimento]],
      },
    ];

    await SheetsService.batchUpdateCells(spreadsheetId, updates);
  }

  static async handleAddOutro(
    spreadsheetId: string,
    aba: string,
    columns: any,
    gastoServicos: string,
    valor: number,
    status: string
  ) {
    const range = await this.getRange(spreadsheetId, aba, columns);
    const valuesToAppend = [[gastoServicos, valor, status]];
    await SheetsService.addDataSheets(spreadsheetId, valuesToAppend, range);
  }

  static async getRange(spreadsheetId: string, aba: string, columns: any) {
    const sheets = AuthSingleton.getSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${aba}!${columns.inicio}:${columns.fim}`,
    });

    const match = columns.inicio.match(/\d+/);
    const row = response.data.values || [];
    const lastRow = row.length + parseInt(match[0]);

    return `${aba}!${columns.campos.gastos_servicos}${lastRow}:${columns.campos.status}${lastRow}`;
  }
}
