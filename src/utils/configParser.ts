import fs from "fs";

export function loadConfig(filePath: string) {
  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const config = JSON.parse(rawData);
    return config;
  } catch (error: any) {
    throw { message: `Erro ao carregar configurações ${error.message}` };
  }
}
