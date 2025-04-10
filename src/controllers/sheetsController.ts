import { ConfigSingleton } from "../utils/configLoader";
import { SheetsService } from "./../services/sheetsService";
import { Request, Response } from "express";

export class SheetsController {
  static async getRows(req: Request, res: Response) {
    const { page } = req.body;

    const pageConfig = ConfigSingleton.getPage(page);
    if (!pageConfig) {
      res.status(500).json({ error: "Configuração da página inválida!" });
      return;
    }

    try {
      const config = ConfigSingleton.getConfig();
      const data = await SheetsService.getSpreadsheetData(
        config.planilha.id,
        pageConfig
      );
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    }
  }

  static async addRows(req: Request, res: Response) {
    const { page, values } = req.body;

    const pageConfig = ConfigSingleton.getPage(page);

    if (!pageConfig) {
      res.status(500).json({ error: "Configuração da página inválida!" });
      return;
    }

    try {
      const config = ConfigSingleton.getConfig();

      const dynamicRange = await SheetsService.dynamicRange(
        config.planilha.id,
        pageConfig
      );

      const result = await SheetsService.addDataSheets(
        config.planilha.id,
        dynamicRange,
        values
      );

      res.status(200).json({ result });
    } catch (error: any) {
      res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    }
  }

  static async sumValor(req: Request, res: Response) {
    const { page } = req.body;

    const pageConfig = ConfigSingleton.getPage(page);

    if (!pageConfig) {
      res.status(500).json({ error: "Configuração da página inválida!" });
      return;
    }

    try {
      const config = ConfigSingleton.getConfig();
      const result = await SheetsService.sumValues(
        config.planilha.id,
        pageConfig
      );
      res.status(200).json({ result });
    } catch (error: any) {
      res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    }
  }
}
