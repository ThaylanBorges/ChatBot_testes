import { SheetsController } from "./../controllers/sheetsController";
import { Router } from "express";
const sheetsRouter = Router();
const sheetsController = new SheetsController();

sheetsRouter.post("/", sheetsController.getRows);
sheetsRouter.post("/add", sheetsController.addRows);

export default sheetsRouter;
