import type { HttpClient, HttpClientRequest } from "@typeDefs";

export type HttpClientOptions = Omit<RequestInit, keyof HttpClientRequest> & {
  timeout?: number;
  // TODO retry
};

/**
 *
 * Built-in HttpClient implementation, wraps fetch()
 *
 */
const httpClient: HttpClient<HttpClientOptions> = {
  async fetch(endpoint: string, request: HttpClientOptions) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (!request.signal && request.timeout) {
      const controller = new AbortController();
      request.signal = controller.signal;
      timeoutId = setTimeout(() => controller.abort(), request.timeout);
    }

    try {
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
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        throw new Error(
          [
            `Failed to fetch data from ${endpoint}`,
            `Timeout (${request.timeout}ms) exceeded`,
          ].join("\n"),
        );
      }
      throw error;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  },
};

export const getClient = (): HttpClient<HttpClientOptions> => {
  if (typeof fetch !== "function") {
    throw new Error(
      "Built-in HttpClient uses native fetch, but native fetch is not available in this environment! Please either polyfill `window.fetch`, provide a custom HttpClient implementation, or use node 18+",
    );
  }

  return httpClient;
};
