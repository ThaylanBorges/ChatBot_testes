import { Router } from "express";
import sheetsRouter from "./sheetsRouter";
import { getConfig } from "../utils/configLoader";

const router = Router();
const config = getConfig();

switch (config.armazenamento) {
  case "planilha":
    router.use("/sheets", sheetsRouter);
    break;
  case "banco_dados":
    console.log("Banco de dados");
    break;
}

export default router;
