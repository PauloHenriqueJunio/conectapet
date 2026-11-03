import { BadRequestException } from "@nestjs/common";
import { AuthTokenType } from "@prisma/client";
import { AuthTokenService } from "./auth-token.service";

type MockAuthTokenTable = {
  deleteMany: jest.Mock;
  create: jest.Mock;
  findUnique: jest.Mock;
  update: jest.Mock;
};

describe("AuthTokenService", () => {
  let authToken: MockAuthTokenTable;
  let prisma: { authToken: MockAuthTokenTable; $transaction: jest.Mock };
  let service: AuthTokenService;

  beforeEach(() => {
    authToken = {
      deleteMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    };
    prisma = {
      authToken,
      $transaction: jest.fn((ops: unknown[]) => Promise.all(ops)),
    };
    service = new AuthTokenService(prisma as never);
  });

  it("generates a token and invalidates previous unused tokens of the same type", async () => {
    const rawToken = await service.generate(
      "user-1",
      AuthTokenType.PASSWORD_RESET,
    );

    expect(typeof rawToken).toBe("string");
    expect(rawToken.length).toBeGreaterThan(0);
    expect(authToken.deleteMany).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
        type: AuthTokenType.PASSWORD_RESET,
        usedAt: null,
      },
    });
    expect(authToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-1",
          type: AuthTokenType.PASSWORD_RESET,
        }),
      }),
    );
  });

  it("rejects an unknown token", async () => {
    authToken.findUnique.mockResolvedValue(null);

    await expect(
      service.consume("unknown-token", AuthTokenType.EMAIL_VERIFICATION),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects a token already used", async () => {
    authToken.findUnique.mockResolvedValue({
      id: "token-1",
      userId: "user-1",
      type: AuthTokenType.EMAIL_VERIFICATION,
      usedAt: new Date(),
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(
      service.consume("some-token", AuthTokenType.EMAIL_VERIFICATION),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(authToken.update).not.toHaveBeenCalled();
  });

  it("rejects an expired token", async () => {
    authToken.findUnique.mockResolvedValue({
      id: "token-1",
      userId: "user-1",
      type: AuthTokenType.EMAIL_VERIFICATION,
      usedAt: null,
      expiresAt: new Date(Date.now() - 60_000),
    });

    await expect(
      service.consume("some-token", AuthTokenType.EMAIL_VERIFICATION),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(authToken.update).not.toHaveBeenCalled();
  });

  it("rejects a token of the wrong type", async () => {
    authToken.findUnique.mockResolvedValue({
      id: "token-1",
      userId: "user-1",
      type: AuthTokenType.PASSWORD_RESET,
      usedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(
      service.consume("some-token", AuthTokenType.EMAIL_VERIFICATION),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("consumes a valid token once, marking it as used", async () => {
    authToken.findUnique.mockResolvedValue({
      id: "token-1",
      userId: "user-1",
      type: AuthTokenType.EMAIL_VERIFICATION,
      usedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
    });
    authToken.update.mockResolvedValue({});

    const userId = await service.consume(
      "some-token",
      AuthTokenType.EMAIL_VERIFICATION,
    );

    expect(userId).toBe("user-1");
    expect(authToken.update).toHaveBeenCalledWith({
      where: { id: "token-1" },
      data: { usedAt: expect.any(Date) },
    });
  });
});
