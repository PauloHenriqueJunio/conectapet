import { buildRateLimitMessage } from "./rate-limit-message";

describe("buildRateLimitMessage", () => {
  it("formats the message with limit and rounded retry seconds", () => {
    const message = buildRateLimitMessage({
      limit: 5,
      timeToExpire: 3200,
    });

    expect(message).toContain("Limite atual: 5");
    expect(message).toContain("Tente novamente em 4s");
  });

  it("uses safe defaults when detail data is missing", () => {
    const message = buildRateLimitMessage({});

    expect(message).toContain("Limite atual: 0");
    expect(message).toContain("Tente novamente em 1s");
  });
});
