import { ConfigSingleton } from "../utils/configLoader";
import { Teste } from "../utils/teste";
import { SheetsService } from "./../services/sheetsService";
import { Request, Response } from "express";

export class SheetsController {
  static async getRows(req: Request, res: Response) {
    const { pageName, type } = req.body;
    const columns = ConfigSingleton.getColuns(type);

    try {
      const config = ConfigSingleton.getConfig();
      const data = await SheetsService.getSpreadsheetData(
        config.planilha.id,
        pageName,
        columns
      );

      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    }
  }

  static async addRow(req: Request, res: Response) {
    const {
      pageName,
      type,
      pagador,
      servico,
      valor,
      tipoPagamento,
      tipoPlano,
      dataVencimento,
      status,
      gasto,
    } = req.body;

    try {
      const config = ConfigSingleton.getConfig();
      const categoryConfig = config.planilha.categorias[type];

      if (!categoryConfig) {
        throw new Error("Categoria não encontrada no config");
      }

      const aba = pageName || ConfigSingleton.getMonthTabName();

      if (type === "planos_alunos") {
        await Teste.addStudent(
          config.planilha.id,
          aba,
          categoryConfig.colunas,
          pagador,
          servico,
          valor,
          tipoPagamento,
          tipoPlano,
          dataVencimento
        );
      }
      if (type === "despesas") {
        await Teste.addExpenses(
          config.planilha.id,
          aba,
          categoryConfig.colunas,
          gasto,
          valor,
          status
        );
      }

      res.status(200).json({ message: "Valores adicionados com sucesso" });
    } catch (error: any) {
      res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    }
  }

  static async updateRow(req: Request, res: Response) {
    const {
      pageName,
      type,
      pagador,
      servico,
      valor,
      tipoPagamento,
      tipoPlano,
      dataVencimento,
      status,
      gasto,
    } = req.body;

    try {
      const config = ConfigSingleton.getConfig();
      const categoryConfig = config.planilha.categorias[type];
      if (!categoryConfig) {
        throw new Error("Categoria não encontrada no config");
      }

      const aba = pageName || ConfigSingleton.getMonthTabName();

      if (type === "planos_alunos") {
        await Teste.updateStudent(
          config.planilha.id,
          aba,
          categoryConfig.colunas,
          pagador,
          servico,
          valor,
          tipoPagamento,
          tipoPlano,
          dataVencimento
        );
      }
      if (type === "despesas") {
        await Teste.updateExpenses(
          config.planilha.id,
          aba,
          categoryConfig.colunas,
          gasto,
          valor,
          status
        );
      }

      res.status(200).json({ message: "Valores atualizados com sucesso" });
    } catch (error: any) {
      res.status(500).json({ error: `Erro no servidor. ${error.message}` });
    }
  }
}
