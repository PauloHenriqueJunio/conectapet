import { Injectable } from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";

interface AttemptState {
  firstFailureAt: number;
  failures: number;
  lockedUntil?: number;
}

@Injectable()
export class LoginAttemptService {
  private readonly attempts = new Map<string, AttemptState>();
  private readonly maxFailures = 5;
  private readonly failureWindowMs = 15 * 60 * 1000;
  private readonly lockDurationMs = 15 * 60 * 1000;

  assertNotBlocked(rawEmail: string) {
    const email = this.normalizeEmail(rawEmail);
    const state = this.attempts.get(email);

    if (!state?.lockedUntil) {
      return;
    }

    const now = Date.now();

    if (state.lockedUntil <= now) {
      this.attempts.delete(email);
      return;
    }

    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((state.lockedUntil - now) / 1000),
    );

    throw new ThrottlerException(
      `Muitas tentativas de login falharam. Tente novamente em ${retryAfterSeconds}s.`,
    );
  }

  registerFailure(rawEmail: string) {
    const email = this.normalizeEmail(rawEmail);
    const now = Date.now();
    const current = this.attempts.get(email);

    if (!current || now - current.firstFailureAt > this.failureWindowMs) {
      this.attempts.set(email, {
        firstFailureAt: now,
        failures: 1,
      });
      return;
    }

    const failures = current.failures + 1;
    const nextState: AttemptState = {
      ...current,
      failures,
    };

    if (failures >= this.maxFailures) {
      nextState.lockedUntil = now + this.lockDurationMs;
    }

    this.attempts.set(email, nextState);
  }

  registerSuccess(rawEmail: string) {
    const email = this.normalizeEmail(rawEmail);
    this.attempts.delete(email);
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }
}
