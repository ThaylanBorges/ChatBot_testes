import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";

const auth = new GoogleAuth({
  keyFile: "./src/key.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export class SheetsService {
  static async auth(): Promise<any> {
    try {
      const authClient = await auth.getClient();
      return authClient;
    } catch (error: any) {
      console.error("Erro ao autenticar:", error);
      throw error;
    }
  }

  static async extractId(url: string): Promise<string | null> {
    try {
      const regex = /\/d\/([a-zA-Z0-9-_]+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error: any) {
      console.error("Erro ao extrair ID:", error);
      throw error;
    }
  }

  static async editSheets(url: string): Promise<void> {
    try {
      const authClient = await this.auth();
      const spreadsheetId = await this.extractId(url);

      if (!spreadsheetId) {
        throw new Error("ID da planilha não encontrado.");
      }

      const sheets = google.sheets({ version: "v4", auth: authClient });

      const valores = [
        ["2025-03-25", "Posto de Gasolina", "200.00", "Transporte"],
      ];

      const request = {
        spreadsheetId,
        range: "Página1!A1:D1", // Ajuste o intervalo conforme necessário
        valueInputOption: "USER_ENTERED",
        resource: {
          values: valores,
        },
      };

      await sheets.spreadsheets.values.append(request);
      console.log("Gasto adicionado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao editar a planilha:", error);
      throw error;
    }
  }
}
