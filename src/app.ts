import express from "express";
import dotenv from "dotenv";
import router from "./routes/router";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", router);

const port = 48003;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
