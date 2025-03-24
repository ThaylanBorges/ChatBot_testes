import express from "express";
import { SheetsService } from "./services/sheetsService";

const app = express();
app.use(express.json());
const port = 48003;

app.post("/auth", async (req, res) => {
  const token = await SheetsService.auth();
  res.json({ token });
});

app.post("/extractId", async (req, res) => {
  const { url } = req.body;
  const id = await SheetsService.extractId(url);
  res.json({ id });
});

app.post("/editSheets", async (req, res) => {
  const { url } = req.body;
  await SheetsService.editSheets(url);
  res.json({ message: "Deu bom" });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
