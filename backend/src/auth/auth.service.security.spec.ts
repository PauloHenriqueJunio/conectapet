import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Role } from "@prisma/client";
import { ThrottlerException } from "@nestjs/throttler";
import { AuthService } from "./auth.service";

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn(),
}));

import * as bcrypt from "bcrypt";

type MockPrismaUser = {
  findUnique: jest.Mock;
  create: jest.Mock;
  findMany: jest.Mock;
};

const createPrismaMock = (): { user: MockPrismaUser } => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
});

describe("AuthService - security", () => {
  const jwtService = {
    signAsync: jest.fn().mockResolvedValue("jwt-token"),
  };

  const cepValidationService = {
    validate: jest.fn().mockResolvedValue({ state: "AL", city: "Maceio" }),
  };

  const loginAttemptService = {
    assertNotBlocked: jest.fn(),
    registerFailure: jest.fn(),
    registerSuccess: jest.fn(),
  };

  const createService = (prisma: { user: MockPrismaUser }) =>
    new AuthService(
      prisma as never,
      jwtService as never,
      cepValidationService as never,
      loginAttemptService as never,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects ONG registration without valid CNPJ", async () => {
    const prisma = createPrismaMock();
    const service = createService(prisma);

    await expect(
      service.register({
        name: "ONG Teste",
        email: "ong@test.com",
        password: "123456",
        role: Role.ONG,
        cep: "57000-000",
        contact: "82999999999",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(cepValidationService.validate).not.toHaveBeenCalled();
  });

  it("rejects pessoa fisica when CNPJ is provided", async () => {
    const prisma = createPrismaMock();
    const service = createService(prisma);

    await expect(
      service.register({
        name: "Pessoa",
        email: "pf@test.com",
        password: "123456",
        role: Role.PESSOA_FISICA,
        cep: "57000-000",
        cnpj: "12.345.678/0001-90",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects ONG when CPF is provided", async () => {
    const prisma = createPrismaMock();
    const service = createService(prisma);

    await expect(
      service.register({
        name: "ONG",
        email: "ong2@test.com",
        password: "123456",
        role: Role.ONG,
        cep: "57000-000",
        cnpj: "12.345.678/0001-90",
        cpf: "123.456.789-01",
        contact: "82999999999",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects invalid CEP length before external lookup", async () => {
    const prisma = createPrismaMock();
    const service = createService(prisma);

    await expect(
      service.register({
        name: "Pessoa",
        email: "pf2@test.com",
        password: "123456",
        role: Role.PESSOA_FISICA,
        cep: "12345",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(cepValidationService.validate).not.toHaveBeenCalled();
  });

  it("rejects duplicate email", async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique.mockResolvedValueOnce({ id: "existing" });
    const service = createService(prisma);

    await expect(
      service.register({
        name: "Pessoa",
        email: "pf3@test.com",
        password: "123456",
        role: Role.PESSOA_FISICA,
        cep: "57000-000",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects duplicate CPF", async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: "existing-cpf" });

    const service = createService(prisma);

    await expect(
      service.register({
        name: "Pessoa",
        email: "pf4@test.com",
        password: "123456",
        role: Role.PESSOA_FISICA,
        cep: "57000-000",
        cpf: "123.456.789-01",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects duplicate CNPJ", async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: "existing-cnpj" });

    const service = createService(prisma);

    await expect(
      service.register({
        name: "ONG",
        email: "ong3@test.com",
        password: "123456",
        role: Role.ONG,
        cep: "57000-000",
        cnpj: "12.345.678/0001-90",
        contact: "82999999999",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("normalizes email and sensitive docs before persisting", async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: "user-1" });

    const service = createService(prisma);

    await service.register({
      name: "Pessoa",
      email: "UPPER@TEST.COM",
      password: "123456",
      role: Role.PESSOA_FISICA,
      cep: "57000-000",
      cpf: "123.456.789-01",
    });

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "upper@test.com",
          cep: "57000000",
          cpf: "12345678901",
        }),
      }),
    );
  });

  it("fails login with unknown email without leaking existence details", async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue(null);
    const service = createService(prisma);

    await expect(
      service.login({ email: "missing@test.com", password: "123456" }),
    ).rejects.toEqual(new UnauthorizedException("Credenciais inválidas."));

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(loginAttemptService.assertNotBlocked).toHaveBeenCalledWith(
      "missing@test.com",
    );
    expect(loginAttemptService.registerFailure).toHaveBeenCalledWith(
      "missing@test.com",
    );
  });

  it("fails login with wrong password", async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "user@test.com",
      passwordHash: "hash",
      role: Role.PESSOA_FISICA,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const service = createService(prisma);

    await expect(
      service.login({ email: "user@test.com", password: "wrongpass" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(loginAttemptService.registerFailure).toHaveBeenCalledWith(
      "user@test.com",
    );
  });

  it("returns token only when password matches", async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "User",
      email: "user@test.com",
      passwordHash: "hash",
      role: Role.PESSOA_FISICA,
      cep: "57000000",
      state: "AL",
      city: "Maceio",
      contact: null,
      address: null,
      cpf: null,
      cnpj: null,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const service = createService(prisma);

    const result = await service.login({
      email: "USER@TEST.COM",
      password: "123456",
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "user@test.com" },
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      userId: "user-1",
      role: Role.PESSOA_FISICA,
    });
    expect(result.accessToken).toBe("jwt-token");
    expect(loginAttemptService.registerSuccess).toHaveBeenCalledWith(
      "user@test.com",
    );
  });

  it("denies login when account is temporarily blocked", async () => {
    const prisma = createPrismaMock();
    loginAttemptService.assertNotBlocked.mockImplementation(() => {
      throw new ThrottlerException("blocked");
    });

    const service = createService(prisma);

    await expect(
      service.login({ email: "user@test.com", password: "123456" }),
    ).rejects.toBeInstanceOf(ThrottlerException);

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
});
