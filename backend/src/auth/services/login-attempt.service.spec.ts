import { ThrottlerException } from "@nestjs/throttler";
import { LoginAttemptService } from "./login-attempt.service";

describe("LoginAttemptService", () => {
  let service: LoginAttemptService;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-01T00:00:00.000Z"));
    service = new LoginAttemptService();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("blocks account after repeated failures", () => {
    const email = "user@test.com";

    for (let index = 0; index < 5; index += 1) {
      service.registerFailure(email);
    }

    expect(() => service.assertNotBlocked(email)).toThrow(ThrottlerException);
  });

  it("unblocks account after lock duration expires", () => {
    const email = "user@test.com";

    for (let index = 0; index < 5; index += 1) {
      service.registerFailure(email);
    }

    jest.advanceTimersByTime(15 * 60 * 1000 + 1000);

    expect(() => service.assertNotBlocked(email)).not.toThrow();
  });

  it("clears attempt history on successful login", () => {
    const email = "user@test.com";

    for (let index = 0; index < 4; index += 1) {
      service.registerFailure(email);
    }

    service.registerSuccess(email);
    expect(() => service.assertNotBlocked(email)).not.toThrow();

    for (let index = 0; index < 4; index += 1) {
      service.registerFailure(email);
    }

    expect(() => service.assertNotBlocked(email)).not.toThrow();
  });
});
