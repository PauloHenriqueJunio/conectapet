interface RateLimitDetail {
  timeToExpire?: number;
  limit?: number;
}

export function buildRateLimitMessage(detail: RateLimitDetail) {
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((detail.timeToExpire ?? 1000) / 1000),
  );
  const limit = detail.limit ?? 0;

  return `Muitas tentativas detectadas. Limite atual: ${limit} requisições. Tente novamente em ${retryAfterSeconds}s.`;
}
