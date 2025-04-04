import { Router } from "express";
import sheetsRouter from "./sheetsRouter";
import { ConfigSingleton } from "../utils/configLoader";

const router = Router();
const config = ConfigSingleton.getConfig();

switch (config.armazenamento) {
  case "planilha":
    router.use("/sheets", sheetsRouter);
    break;
  case "banco_dados":
    console.log("Banco de dados");
    break;
  default:
    console.error("Armazenamento desconhecido:", config.armazenamento);
    break;
}

export default router;
