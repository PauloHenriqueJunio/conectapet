import { UnauthorizedException } from "@nestjs/common";
import { Role } from "@prisma/client";
import { JwtStrategy } from "./jwt.strategy";

describe("JwtStrategy", () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const configService = {
    getOrThrow: jest.fn().mockReturnValue("secret"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns normalized user payload for valid token user", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      role: Role.ONG,
    });

    const strategy = new JwtStrategy(prisma as never, configService as never);

    await expect(
      strategy.validate({ userId: "user-1", role: Role.ONG }),
    ).resolves.toEqual({
      userId: "user-1",
      role: Role.ONG,
    });
  });

  it("throws UnauthorizedException when token references missing user", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const strategy = new JwtStrategy(prisma as never, configService as never);

    await expect(
      strategy.validate({ userId: "missing-user", role: Role.ONG }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
