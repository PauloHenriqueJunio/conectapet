import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Role } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtPayload } from "../types/jwt-payload.type";

const AUTH_COOKIE_NAME = "conectapet_session";

function extractTokenFromCookie(req: {
  headers?: { cookie?: string };
}): string | null {
  const cookieHeader = req?.headers?.cookie;

  if (!cookieHeader) {
    return null;
  }

  const pairs = cookieHeader.split(";");

  for (const pair of pairs) {
    const [rawName, ...rawValueParts] = pair.trim().split("=");

    if (rawName !== AUTH_COOKIE_NAME) {
      continue;
    }

    const rawValue = rawValueParts.join("=");
    return decodeURIComponent(rawValue);
  }

  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractTokenFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedException("Token inválido.");
    }

    return {
      userId: user.id,
      role: user.role as Role,
    };
  }
}
