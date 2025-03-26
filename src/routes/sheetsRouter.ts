import { Request, Response, Router } from "express";
import { loadConfig } from "../utils/configParser";
import { SheetsService } from "../services/sheetsService";

const sheetsRouter = Router();

sheetsRouter.post("/sheets", async (req: Request, res: Response) => {
  const { client, range } = req.body;

  try {
    const config = loadConfig("./.config");

    if (config.armazenamento === "planilha") {
      const data = await SheetsService.getSpreadsheetData(
        config.planilha.id,
        range
      );
      res.json({ client: config.cliente, dados: data });
      return;
    }

    res.status(400).json({ error: "Tipo de armazenamento não suportado." });
    return;
  } catch (error: any) {
    res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    return;
  }
});

sheetsRouter.post("/sheets/add", async (req: Request, res: Response) => {
  const { client, range, values } = req.body;
  try {
    const config = loadConfig("./.config");

    if (config.armazenamento === "planilha") {
      const result = await SheetsService.addDataSheets(
        config.planilha.id,
        range,
        values
      );
      res.json({ cliente: config.cliente, resultado: result });
      return;
    }

    res.status(400).json({ error: "Tipo de armazenamento não suportado." });
    return;
  } catch (error: any) {
    res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    return;
  }
});

export default sheetsRouter;
