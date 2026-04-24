const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  token?: string,
): Promise<T> {
  const shouldAttachBearer =
    typeof token === "string" && token.split(".").length === 3;
  const extraHeaders = (options?.headers ?? {}) as Record<string, string>;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(shouldAttachBearer ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Erro na requisição.");
  }

  return (await response.json()) as T;
}
