import { ConfigSingleton } from "../utils/configLoader";
import { SheetsService } from "./../services/sheetsService";
import { Request, Response } from "express";

export class SheetsController {
  private config = ConfigSingleton.getConfig();
  private sheetsService = new SheetsService();

  getRows = async (req: Request, res: Response) => {
    try {
      const data = await this.sheetsService.getSpreadsheetData(
        this.config.planilha.id
      );

      
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    }
  };

  addRows = async (req: Request, res: Response) => {
    const { values } = req.body;

    try {
      const result = await this.sheetsService.addDataSheets(
        this.config.planilha.id,
        values
      );

      res.status(200).json({ result });
    } catch (error: any) {
      res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    }
  };
}
