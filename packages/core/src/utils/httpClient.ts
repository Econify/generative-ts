import type { HttpClient } from "@typeDefs";

const httpClient: HttpClient = {
  async post(endpoint: string, body: string, headers: Record<string, string>) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body,
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
