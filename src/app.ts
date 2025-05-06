import express from "express";
import dotenv from "dotenv";
import router from "./routes/router";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swaggeer.json";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
