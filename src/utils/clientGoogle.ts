import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

export class AuthSingleton {
  private static instance: GoogleAuth;

  private constructor() {}

  static getInstance(): GoogleAuth {
    if (!AuthSingleton.instance) {
      try {
        AuthSingleton.instance = new GoogleAuth({
          keyFile: process.env.GOOGLE_CREDENTIALS,
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
      } catch (error: any) {
        throw new Error(`Erro ao inicializar autenticação: ${error.message}`);
      }
    }

    return AuthSingleton.instance;
  }

  static getSheetsClient() {
    const auth = AuthSingleton.getInstance();
    return google.sheets({ version: "v4", auth });
  }
}
