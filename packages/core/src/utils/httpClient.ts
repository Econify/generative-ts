import type { HttpClient } from "@typeDefs";

interface CustomOptions {
  timeout?: number;
}

type BuiltinHttpClientOptions = Omit<
  RequestInit,
  "method" | "headers" | "body"
> &
  CustomOptions;

const httpClient: HttpClient<BuiltinHttpClientOptions> = {
  async post(
    endpoint: string,
    body: string,
    headers: Record<string, string>,
    options?: BuiltinHttpClientOptions,
  ) {
    // TODO: if options.timeout && !options.signal, impl timeout

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body,
      ...options,
    });

    if (!response.ok) {
      const text = await response.text();

      const errorMessage = [
        `Failed to fetch data from ${endpoint}`,
        `status: ${response.status}`,
        `response: ${text}`,
      ].join("\n");

      throw new Error(errorMessage);
    }

    return response.json();
  },
};

export const getClient = () => {
  if (typeof fetch !== "function") {
    throw new Error(
      "Built-in HttpClient uses native fetch, but native fetch is not available in this environment! Please either polyfill `window.fetch`, use node 18+ (if server), or provide a custom HttpClient implementation.",
    );
  }

  return httpClient;
};
