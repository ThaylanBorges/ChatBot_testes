import { SheetsController } from "./../controllers/sheetsController";
import { Router } from "express";
const sheetsRouter = Router();

sheetsRouter.get("/:pageName", SheetsController.getRows);
sheetsRouter.post("/update", SheetsController.updateRow);
sheetsRouter.post("/add", SheetsController.addRow);

export default sheetsRouter;
