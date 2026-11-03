import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthTokenType } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";
import { PrismaService } from "../../prisma/prisma.service";

const EXPIRATION_MS: Record<AuthTokenType, number> = {
  [AuthTokenType.EMAIL_VERIFICATION]: 24 * 60 * 60 * 1000,
  [AuthTokenType.PASSWORD_RESET]: 60 * 60 * 1000,
};

@Injectable()
export class AuthTokenService {
  constructor(private readonly prisma: PrismaService) {}

  private hash(rawToken: string): string {
    return createHash("sha256").update(rawToken).digest("hex");
  }

  /**
   * Gera um novo token, invalidando os anteriores do mesmo tipo para o
   * usuário. Retorna o token em texto puro, que deve ir só no e-mail: no
   * banco fica salvo apenas o hash.
   */
  async generate(userId: string, type: AuthTokenType): Promise<string> {
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = this.hash(rawToken);
    const expiresAt = new Date(Date.now() + EXPIRATION_MS[type]);

    await this.prisma.$transaction([
      this.prisma.authToken.deleteMany({
        where: { userId, type, usedAt: null },
      }),
      this.prisma.authToken.create({
        data: { userId, type, tokenHash, expiresAt },
      }),
    ]);

    return rawToken;
  }

  /**
   * Valida e consome um token (marca como usado). Lança BadRequestException
   * se o token não existir, já tiver sido usado ou estiver expirado.
   */
  async consume(rawToken: string, type: AuthTokenType): Promise<string> {
    const tokenHash = this.hash(rawToken);

    const token = await this.prisma.authToken.findUnique({
      where: { tokenHash },
    });

    if (!token || token.type !== type) {
      throw new BadRequestException("Token inválido.");
    }

    if (token.usedAt) {
      throw new BadRequestException("Este token já foi utilizado.");
    }

    if (token.expiresAt < new Date()) {
      throw new BadRequestException("Token expirado.");
    }

    await this.prisma.authToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    });

    return token.userId;
  }
}
