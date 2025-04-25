import { ConfigSingleton } from "../utils/configLoader";
import { SpreadsheetHelper } from "../utils/spreadsheetHelper";
import { SheetsService } from "./../services/sheetsService";
import { Request, Response } from "express";

export class SheetsController {
  static async getRows(req: Request, res: Response) {
    const { pageName, type } = req.body;
    const columns = ConfigSingleton.getColuns(type);

    try {
      const config = ConfigSingleton.getConfig();
      const data = await SheetsService.getSpreadsheetData(
        config.planilha.id,
        pageName,
        columns
      );

      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    }
  }

  static async addRow(req: Request, res: Response) {
    const { pageName, type, ...data } = req.body;

    try {
      const config = ConfigSingleton.getConfig();

      const categoryConfig = config.planilha.categorias[type];

      if (!categoryConfig) {
        throw new Error("Categoria não encontrada");
      }

      const aba = pageName || ConfigSingleton.getMonthTabName();

      console.log(categoryConfig);

      await SpreadsheetHelper.addData(
        config.planilha.id,
        aba,
        categoryConfig.colunas,
        data
      );

      res.status(200).json({ message: "Valores adicionados com sucesso" });
    } catch (error: any) {
      res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    }
  }

  static async updateRow(req: Request, res: Response) {
    const { pageName, type, searchValue, columnSearch, ...updateFields } =
      req.body;

    try {
      const config = ConfigSingleton.getConfig();
      const categoryConfig = config.planilha.categorias[type];

      if (!categoryConfig) {
        throw new Error("Categoria não encontrada no config");
      }

      const aba = pageName || ConfigSingleton.getMonthTabName();

      await SpreadsheetHelper.updateData(
        config.planilha.id,
        aba,
        categoryConfig.colunas,
        searchValue,
        updateFields
      );

      res.status(200).json({ message: "Valores atualizados com sucesso" });
    } catch (error: any) {
      res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    }
  }
}
