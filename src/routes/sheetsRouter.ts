import { Request, Response, Router } from "express";
import { SheetsService } from "../services/sheetsService";
import { getConfig } from "../utils/configLoader";

const sheetsRouter = Router();
const config = getConfig();

sheetsRouter.post("/", async (req: Request, res: Response) => {
  const { range } = req.body;

  try {
    const data = await SheetsService.getSpreadsheetData(
      config.planilha.id,
      range
    );

    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: `Erro no servidor. ${error.message}` });
  }
});

sheetsRouter.post("/add", async (req: Request, res: Response) => {
  const { range, values } = req.body;
  try {
    const result = await SheetsService.addDataSheets(
      config.planilha.id,
      range,
      values
    );

    res.status(200).json({ result });
  } catch (error: any) {
    res.status(500).json({ error: `Erro no servidor. ${error.message}` });
  }
});

export default sheetsRouter;
