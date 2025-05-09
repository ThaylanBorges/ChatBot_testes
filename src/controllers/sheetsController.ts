import { ConfigSingleton } from "../utils/configLoader";
import { SpreadsheetHelper } from "../utils/spreadsheetHelper";
import { SheetsService } from "./../services/sheetsService";
import { Request, Response } from "express";

export class SheetsController {
  static async getRows(req: Request, res: Response) {
    const type = req.query.type;
    const pageName = req.params.pageName;

    try {
      if (!type || typeof type !== "string") {
        res.status(400).json({ error: "Tipo inválido." });
        return;
      }

      const config = ConfigSingleton.getConfig();
      const categoryConfig = SpreadsheetHelper.getCategoryConfig(type, config);

      const data = await SheetsService.getSpreadsheetData(
        config.planilha.id,
        pageName,
        categoryConfig.colunas
      );

      res.status(200).json({ data });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || `Erro no servidor. ${error.message}` });
    }
  }

  static async addRow(req: Request, res: Response) {
    const { pageName, type, ...data } = req.body;

    try {
      const config = ConfigSingleton.getConfig();
      const categoryConfig = SpreadsheetHelper.getCategoryConfig(type, config);
      const aba = pageName || SpreadsheetHelper.getMonthTabName();
      const campos = Object.values(categoryConfig.colunas.campos);
      const primeiraColuna = campos[0];
      const ultimaColuna = campos.slice(-1)[0];

      const range = await SheetsService.getRange(
        config.planilha.id,
        aba,
        categoryConfig.colunas,
        primeiraColuna,
        ultimaColuna
      );

      const values = Object.values(data);

      await SheetsService.addDataSheets(config.planilha.id, values, range);

      res.status(200).json({ message: "Valores adicionados com sucesso" });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || `Erro no servidor. ${error.message}` });
    }
  }

  static async updateRow(req: Request, res: Response) {
    const { pageName, type, searchValue, ...updateFields } = req.body;

    try {
      const config = ConfigSingleton.getConfig();
      const categoryConfig = SpreadsheetHelper.getCategoryConfig(type, config);
      const aba = pageName || SpreadsheetHelper.getMonthTabName();

      const rows = await SheetsService.getSpreadsheetData(
        config.planilha.id,
        aba,
        categoryConfig.colunas
      );

      if (!rows || rows.length === 0) {
        res.status(500).json({ error: `Nenhum dado encontrado na planilha` });
        return;
      }

      const rowIndex = rows.findIndex((row: any) => {
        return Object.values(row)[0] === searchValue;
      });

      if (rowIndex === -1) {
        res.status(404).json({ error: `Registro não encontrado na planilha` });
        return;
      }

      const startingRow = SpreadsheetHelper.extractRowNumber(
        categoryConfig.colunas.inicio
      );

      const actualRow = startingRow + rowIndex;

      const updates = Object.keys(updateFields).map((field: any) => ({
        range: `${aba}!${categoryConfig.colunas.campos[field]}${actualRow}`,
        values: [[updateFields[field]]],
      }));

      await SheetsService.batchUpdateCells(config.planilha.id, updates);

      res.status(200).json({ message: "Valores atualizados com sucesso" });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || `Erro no servidor. ${error.message}` });
    }
  }
}
