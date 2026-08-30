import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Resend } from "resend";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private client: Resend | null = null;

  private getClient(): Resend {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new ServiceUnavailableException(
        "Configuração do Resend ausente: RESEND_API_KEY.",
      );
    }

    if (!this.client) {
      this.client = new Resend(apiKey);
    }

    return this.client;
  }

  async sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
    const client = this.getClient();
    const from = process.env.EMAIL_FROM ?? "ConectaPet <onboarding@resend.dev>";

    const { error } = await client.emails.send({ from, to, subject, html });

    if (error) {
      this.logger.error(`Falha ao enviar e-mail para ${to}: ${error.message}`);
      throw new ServiceUnavailableException(
        "Não foi possível enviar o e-mail no momento.",
      );
    }
  }
}
