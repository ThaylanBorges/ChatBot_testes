import { ConfigSingleton } from "../utils/configLoader";
import { SheetsService } from "./../services/sheetsService";
import { Request, Response } from "express";

export class SheetsController {
  static async getRows(req: Request, res: Response) {
    try {
      const config = ConfigSingleton.getConfig();
      const data = await SheetsService.getSpreadsheetData(config.planilha.id);
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    }
  }

  static async addRows(req: Request, res: Response) {
    const { values } = req.body;
    try {
      const config = ConfigSingleton.getConfig();
      const result = await SheetsService.addDataSheets(
        config.planilha.id,
        values
      );
      res.status(200).json({ result });
    } catch (error: any) {
      res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    }
  }
}
