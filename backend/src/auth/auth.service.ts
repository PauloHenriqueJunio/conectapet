import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./types/jwt-payload.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const normalizedCpf = dto.cpf?.replace(/\D/g, "") ?? "";
    const normalizedCnpj = dto.cnpj?.replace(/\D/g, "") ?? "";

    if (dto.role === Role.ONG && normalizedCnpj.length !== 14) {
      throw new BadRequestException("CNPJ obrigatório e inválido para ONG.");
    }

    if (normalizedCpf.length > 0 && normalizedCpf.length !== 11) {
      throw new BadRequestException("CPF inválido.");
    }

    if (dto.role === Role.ADOTANTE && normalizedCnpj.length > 0) {
      throw new BadRequestException("Pessoa física não deve informar CNPJ.");
    }

    if (dto.role === Role.ONG && normalizedCpf.length > 0) {
      throw new BadRequestException("ONG não deve informar CPF.");
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException("Email já cadastrado.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        passwordHash,
        role: dto.role,
        cpf: normalizedCpf || null,
        cnpj: normalizedCnpj || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        cnpj: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas.");
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException("Credenciais inválidas.");
    }

    const payload: JwtPayload = {
      userId: user.id,
      role: user.role as Role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        cnpj: user.cnpj,
        role: user.role,
      },
    };
  }
}
