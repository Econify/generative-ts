import type { HttpClient } from "@typeDefs";

export type BuiltinHttpClientOptions = Omit<
  RequestInit,
  "method" | "body" | "headers" // get keys of HttpClientRequest:
> & {
  timeout?: number;
};

/**
 *
 * Built-in HttpClient implementation, wraps fetch()
 *
 */
const httpClient: HttpClient<BuiltinHttpClientOptions> = {
  async fetch(endpoint: string, request: BuiltinHttpClientOptions) {
    if (!request.signal && request.timeout) {
      // TODO
      console.warn("Custom timeout not implemented yet!");
    }

    const response = await fetch(endpoint, request);

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

export const getClient = (): HttpClient<BuiltinHttpClientOptions> => {
  if (typeof fetch !== "function") {
    throw new Error(
      "Built-in HttpClient uses native fetch, but native fetch is not available in this environment! Please either polyfill `window.fetch`, provide a custom HttpClient implementation, or use node 18+",
    );
  }

  return httpClient;
};
