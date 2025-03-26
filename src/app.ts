import express from "express";
import sheetsRouter from "./routes/sheetsRouter";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
const port = 48003;

app.use("/api", sheetsRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
