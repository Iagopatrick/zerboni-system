import { FiscalReportRepository } from "./fiscal-report.repository";

export class FiscalReportService {
  private repository = new FiscalReportRepository();

  async listRecords(userType: number, filters: any) {
    // RN01: Somente Administrador (tipo 1 no seu diagrama) pode acessar
    if (Number(userType) !== 1) {
      throw new Error(
        "Acesso negado. Apenas administradores podem gerar relatórios fiscais.",
      );
    }
    return await this.repository.findRecords(filters);
  }

  // Lógica para os Passos 8 a 12 (Geração do Relatório)
  async generateFile(data: any[], format: "pdf" | "csv", fileName: string) {
    // Aqui integraria bibliotecas como 'jspdf' ou 'csv-writer'

    if (!data || data.length === 0) {
      throw new Error(
        "Não existem movimentações fiscais para o filtro selecionado.",
      );
    }
    console.log(
      `Gerando relatório ${fileName}.${format} com ${data.length} registros...`,
    );
    return { path: `./reports/${fileName}.${format}`, success: true };
  }

  async sendReportByEmail(email: string, filePath: string) {
    if (!email.includes("@")) throw new Error("Endereço de e-mail inválido.");

    // Simulação do envio via serviço de e-mail
    console.log(
      `Enviando relatório localizado em ${filePath} para o e-mail: ${email}`,
    );

    return {
      success: true,
      message: `Relatório enviado com sucesso para ${email}!`,
    };
  }
}
