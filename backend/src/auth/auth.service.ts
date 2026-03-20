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

interface BrasilApiCepResponse {
  state: string;
  city: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async validateCepWithBrasilApi(cep: string) {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);

    if (!response.ok) {
      throw new BadRequestException("CEP inválido ou não encontrado.");
    }

    const data = (await response.json()) as BrasilApiCepResponse;
    return {
      state: data.state,
      city: data.city,
    };
  }

  async register(dto: RegisterDto) {
    const normalizedCpf = dto.cpf?.replace(/\D/g, "") ?? "";
    const normalizedCnpj = dto.cnpj?.replace(/\D/g, "") ?? "";
    const normalizedCep = dto.cep?.replace(/\D/g, "") ?? "";
    const trimmedContact = dto.contact?.trim() ?? "";
    const trimmedAddress = dto.address?.trim() ?? "";

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

    if (normalizedCep.length !== 8) {
      throw new BadRequestException("CEP obrigatório e inválido.");
    }

    if (dto.role === Role.ONG && trimmedContact.length === 0) {
      throw new BadRequestException("Contato é obrigatório para ONG.");
    }

    const cepData = await this.validateCepWithBrasilApi(normalizedCep);

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
        cep: normalizedCep,
        state: cepData.state,
        city: cepData.city,
        contact: trimmedContact || null,
        address: trimmedAddress || null,
        cpf: normalizedCpf || null,
        cnpj: normalizedCnpj || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cep: true,
        state: true,
        city: true,
        contact: true,
        address: true,
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
        cep: user.cep,
        state: user.state,
        city: user.city,
        contact: user.contact,
        address: user.address,
        cpf: user.cpf,
        cnpj: user.cnpj,
        role: user.role,
      },
    };
  }

  async getOngs() {
    return this.prisma.user.findMany({
      where: { role: Role.ONG },
      select: {
        id: true,
        name: true,
        email: true,
        cep: true,
        state: true,
        city: true,
        contact: true,
        address: true,
        cnpj: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
