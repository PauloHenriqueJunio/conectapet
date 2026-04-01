import {
  BadGatewayException,
  BadRequestException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { CepValidationService } from "./cep-validation.service";

describe("CepValidationService", () => {
  const service = new CepValidationService();
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("returns city/state when BrasilAPI call succeeds", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ state: "AL", city: "Maceio" }),
    }) as typeof fetch;

    await expect(service.validate("57000000")).resolves.toEqual({
      state: "AL",
      city: "Maceio",
    });
  });

  it("throws BadRequestException on CEP not found", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }) as typeof fetch;

    await expect(service.validate("00000000")).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("throws BadGatewayException on unexpected upstream status", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }) as typeof fetch;

    await expect(service.validate("57000000")).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });

  it("throws ServiceUnavailableException when fetch aborts", async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(
        Object.assign(new Error("timeout"), { name: "AbortError" }),
      ) as typeof fetch;

    await expect(service.validate("57000000")).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
