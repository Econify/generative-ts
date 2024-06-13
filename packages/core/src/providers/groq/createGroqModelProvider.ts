import type { HttpClient } from "@typeDefs";

import { OpenAiChatApi } from "../../apis/openai";

import { BearerTokenAuthStrategy } from "../http/strategies";

import { HttpModelProvider } from "../http";

import type { InferHttpClientOptions } from "../http";

import type { GroqAuthConfig } from "./authConfig";

/**
 *
 * Creates a Groq {@link ModelProvider} with the {@link OpenAiChatApi}
 *
 * ```ts
 * import { createGroqModelProvider } from "generative-ts";
 *
 * const llama3 = createGroqModelProvider({
 *   modelId: "llama3-70b-8192", // Groq defined model ID
 *   // you can explicitly pass auth here, otherwise by default it is read from process.env
 * });
 *
 * const response = await llama3.sendRequest({
 *   prompt: "Brief History of NY Mets:"
 *   // all other OpenAI ChatCompletion options available here (Groq uses the OpenAI ChatCompletion API for all the models it hosts)
 * });
 *
 * console.log(response.choices[0]?.message.content);
 * ```
 *
 * ### Provider Setup and Notes
 *
 * Create an API account at {@link https://groq.com/ | Groq}
 *
 * Obtain a {@link https://console.groq.com/keys | Groq API key} and either pass them explicitly in `auth` or set them in the environment as `GROQ_API_KEY`
 *
 * Groq uses the {@link https://platform.openai.com/docs/api-reference/chat/create | OpenAI ChatCompletion API} for all the models it hosts.
 *
 * ### Model Parameters
 *
 * - {@link https://platform.openai.com/docs/api-reference/chat/create | OpenAI ChatCompletion API}
 *
 * ### Model IDs
 *
 * - {@link https://console.groq.com/docs/models | Groq Models}
 *
 * @see {@link https://console.groq.com/keys | Groq API keys}
 * @see {@link https://platform.openai.com/docs/api-reference/chat/create | OpenAI ChatCompletion API}
 * @see {@link https://console.groq.com/docs/models | Groq Models}
 *
 * @category Providers
 * @category Provider: Groq
 *
 * @param {Object} params
 * @param {string} params.modelId - The model ID as defined by Groq
 * @param {HttpClient} [params.client] - HTTP client to use for requests. If not supplied, the built-in fetch-based implementation will be used.
 * @param {GroqAuthConfig} [params.auth] - Authentication configuration for Groq. If not supplied, it will be loaded from the environment.
 * @returns {HttpModelProvider<OpenAiChatOptions, OpenAiChatResponse, BaseModelProviderConfig>} The Groq Model Provider with the {@link OpenAiChatApi}
 * @throws {Error} If no auth is passed and GROQ_API_KEY is not found in process.env
 *
 * @example Usage
 * ```ts
 * import { createGroqModelProvider } from "generative-ts";
 *
 * const llama3 = createGroqModelProvider({
 *   modelId: "llama3-70b-8192",
 * });
 *
 * const response = await llama3.sendRequest({ prompt: "Brief History of NY Mets:" });
 *
 * console.log(response.choices[0]?.message.content);
 * ```
 */
export function createGroqModelProvider<
  THttpClientOptions = InferHttpClientOptions<HttpModelProvider>,
>({
  modelId,
  client,
  auth,
}: {
  modelId: string;
  client?: HttpClient<THttpClientOptions>;
  auth?: GroqAuthConfig;
}) {
  const { GROQ_API_KEY } = auth ?? process.env;

  if (!GROQ_API_KEY) {
    throw new Error(
      "Error creating GroqModelProvider: Groq API key (GROQ_API_KEY) not found in process.env. Please either pass `GROQ_API_KEY` explicitly in `auth` or set it in the environment.",
    );
  }

  return new HttpModelProvider({
    api: OpenAiChatApi,
    config: {
      modelId,
    },
    client,
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    auth: new BearerTokenAuthStrategy(GROQ_API_KEY),
  });
}
