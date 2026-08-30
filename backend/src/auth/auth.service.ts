import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AdoptionStatus, Prisma, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { DeleteAccountDto } from "./dto/delete-account.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { CepValidationService } from "./services/cep-validation.service";
import { LoginAttemptService } from "./services/login-attempt.service";
import { JwtPayload } from "./types/jwt-payload.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly cepValidationService: CepValidationService,
    private readonly loginAttemptService: LoginAttemptService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private buildPublicUser(user: {
    id: string;
    name: string;
    email: string;
    cep: string | null;
    state: string | null;
    city: string | null;
    contact: string | null;
    address: string | null;
    photoUrl: string | null;
    role: Role;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      cep: user.cep,
      state: user.state,
      city: user.city,
      contact: user.contact,
      address: user.address,
      photoUrl: user.photoUrl,
      role: user.role,
    };
  }

  private buildFullUser(user: {
    id: string;
    name: string;
    email: string;
    cep: string | null;
    state: string | null;
    city: string | null;
    contact: string | null;
    address: string | null;
    cpf: string | null;
    cnpj: string | null;
    photoUrl: string | null;
    role: Role;
  }) {
    return {
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
      photoUrl: user.photoUrl,
      role: user.role,
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

    if (dto.role === Role.PESSOA_FISICA && normalizedCnpj.length > 0) {
      throw new BadRequestException("Pessoa física não deve informar CNPJ.");
    }

    if (dto.role === Role.ONG && normalizedCpf.length > 0) {
      throw new BadRequestException("ONG não deve informar CPF.");
    }

    if (normalizedCep.length !== 8) {
      throw new BadRequestException("CEP obrigatório e inválido.");
    }

    if (trimmedContact.length === 0) {
      throw new BadRequestException("Contato é obrigatório.");
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException("Email já cadastrado.");
    }

    if (normalizedCpf.length > 0) {
      const existingCpf = await this.prisma.user.findUnique({
        where: { cpf: normalizedCpf },
        select: { id: true },
      });

      if (existingCpf) {
        throw new BadRequestException("CPF já cadastrado.");
      }
    }

    if (normalizedCnpj.length > 0) {
      const existingCnpj = await this.prisma.user.findUnique({
        where: { cnpj: normalizedCnpj },
        select: { id: true },
      });

      if (existingCnpj) {
        throw new BadRequestException("CNPJ já cadastrado.");
      }
    }

    const cepData = await this.cepValidationService.validate(normalizedCep);

    const passwordHash = await bcrypt.hash(dto.password, 12);

    let user;

    try {
      user = await this.prisma.user.create({
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new BadRequestException(
          "Dados duplicados: email, CPF ou CNPJ já cadastrados.",
        );
      }

      throw error;
    }

    return user;
  }

  async login(dto: LoginDto) {
    const normalizedEmail = dto.email.toLowerCase();

    this.loginAttemptService.assertNotBlocked(normalizedEmail);

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      this.loginAttemptService.registerFailure(normalizedEmail);
      throw new UnauthorizedException("Credenciais inválidas.");
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      this.loginAttemptService.registerFailure(normalizedEmail);
      throw new UnauthorizedException("Credenciais inválidas.");
    }

    this.loginAttemptService.registerSuccess(normalizedEmail);

    const payload: JwtPayload = {
      userId: user.id,
      role: user.role as Role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: this.buildPublicUser({
        id: user.id,
        name: user.name,
        email: user.email,
        cep: user.cep,
        state: user.state,
        city: user.city,
        contact: user.contact,
        address: user.address,
        photoUrl: user.photoUrl,
        role: user.role,
      }),
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
        photoUrl: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Token inválido.");
    }

    return this.buildFullUser(user);
  }
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const normalizedCep = dto.cep?.replace(/\D/g, "") ?? "";
    const trimmedContact = dto.contact?.trim() ?? "";
    const trimmedAddress = dto.address?.trim() ?? "";

    if (normalizedCep && normalizedCep.length !== 8) {
      throw new BadRequestException("CEP inválido. Deve conter 8 dígitos.");
    }

    const updateData: {
      email?: string;
      contact?: string | null;
      address?: string | null;
      cep?: string;
      state?: string;
      city?: string;
    } = {};

    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
        select: { id: true },
      });

      if (existingEmail && existingEmail.id !== userId) {
        throw new BadRequestException("Este email já está cadastrado.");
      }

      updateData.email = dto.email.toLowerCase();
    }

    if (dto.contact !== undefined) {
      updateData.contact = trimmedContact || null;
    }

    if (dto.address !== undefined) {
      updateData.address = trimmedAddress || null;
    }

    if (normalizedCep) {
      const cepData = await this.cepValidationService.validate(normalizedCep);
      updateData.cep = normalizedCep;
      updateData.state = cepData.state;
      updateData.city = cepData.city;
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
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
        photoUrl: true,
        role: true,
      },
    });

    return this.buildFullUser(user);
  }

  async uploadPhoto(
    userId: string,
    file: { mimetype: string; size: number; buffer: Buffer },
  ) {
    const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException("Apenas imagens JPG, PNG ou WEBP.");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException("Tamanho máximo permitido é de 5MB.");
    }

    const previousUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { photoUrl: true },
    });

    const uploadResult = await this.cloudinaryService.uploadFile(file);

    if (previousUser?.photoUrl) {
      const previousPublicId = this.cloudinaryService.extractPublicId(
        previousUser.photoUrl,
      );

      if (previousPublicId) {
        // Melhor esforço: se a exclusão da foto antiga falhar, a nova
        // ja foi enviada e o perfil deve ser atualizado normalmente.
        this.cloudinaryService.deleteFile(previousPublicId).catch(() => {});
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { photoUrl: uploadResult.secure_url },
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
        photoUrl: true,
        role: true,
      },
    });

    return this.buildFullUser(user);
  }

  async deleteAccount(userId: string, dto: DeleteAccountDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException("Token inválido.");
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException("Senha incorreta.");
    }

    const pendingRequestsCount = await this.prisma.adoptionRequest.count({
      where: {
        status: AdoptionStatus.PENDING,
        pet: { ongId: userId },
      },
    });

    if (pendingRequestsCount > 0) {
      throw new BadRequestException(
        "Você possui solicitações de adoção pendentes nos seus pets. Aprove ou recuse todas antes de excluir sua conta.",
      );
    }

    // Remove os pets cadastrados pelo usuario antes de excluir a conta, pois
    // a FK de Pet.ongId e Restrict (nao cascateia sozinha).
    await this.prisma.$transaction([
      this.prisma.pet.deleteMany({ where: { ongId: userId } }),
      this.prisma.user.delete({ where: { id: userId } }),
    ]);

    return { success: true };
  }

  async getOngs() {
    return this.prisma.user.findMany({
      where: { role: Role.ONG },
      select: {
        id: true,
        name: true,
        state: true,
        city: true,
        contact: true,
        photoUrl: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
