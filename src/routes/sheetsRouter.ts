import { SheetsController } from "./../controllers/sheetsController";
import { Router } from "express";
const sheetsRouter = Router();

sheetsRouter.post("/", SheetsController.getRows);
sheetsRouter.post("/update", SheetsController.updateRow);

export default sheetsRouter;
