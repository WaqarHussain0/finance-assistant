export async function fetchApiInstance<T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error(`Failed to ${options.method || "GET"} ${endpoint}`);
  }

  return await res.json();
}
