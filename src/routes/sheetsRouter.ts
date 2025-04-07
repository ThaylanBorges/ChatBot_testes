import { SheetsController } from "./../controllers/sheetsController";
import { Router } from "express";
const sheetsRouter = Router();

sheetsRouter.post("/", SheetsController.getRows);
sheetsRouter.post("/add", SheetsController.addRows);
sheetsRouter.post("/sumValues", SheetsController.sumValor);

export default sheetsRouter;
