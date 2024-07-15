import type { HttpClient } from "@typeDefs";

import { OpenAiChatApi } from "../../apis/openai";

import {
  BearerTokenAuthStrategy,
  HttpModelProvider,
  InferHttpClientOptions,
} from "../http";

import type { OpenAiAuthConfig } from "./authConfig";

/**
 *
 * Creates a OpenAI {@link ModelProvider} with the {@link OpenAiChatApi}
 *
 * ```ts
 * import { createOpenAiChatModelProvider } from "generative-ts";
 *
 * const gpt = createOpenAiChatModelProvider({
 *   modelId: "gpt-4-turbo", // OpenAI defined model ID
 *   // you can explicitly pass auth here, otherwise by default it is read from process.env
 * });
 *
 * const response = await gpt.sendRequest({
 *   $prompt: "Brief History of NY Mets:",
 *   max_tokens: 100,
 *   // all other OpenAI ChatCompletion options available here
 * });
 *
 * console.log(response.choices[0]?.message.content);
 * ```
 *
 * ### Provider Setup and Notes
 *
 * Create an API account at {@link https://openai.com/ | OpenAI}
 *
 * Obtain a {@link https://platform.openai.com/api-keys | OpenAI API key} and either pass it explicitly in `auth` or set it in the environment as `OPENAI_API_KEY`
 *
 * ### Model Parameters
 *
 * - {@link https://platform.openai.com/docs/api-reference/chat/create | OpenAI ChatCompletion API}
 *
 * ### Model IDs
 *
 * - {@link https://platform.openai.com/docs/models | OpenAI Models}
 *
 * @see {@link https://platform.openai.com/api-keys | OpenAI API keys}
 * @see {@link https://platform.openai.com/docs/api-reference/chat/create | OpenAI ChatCompletion API}
 * @see {@link https://platform.openai.com/docs/models | OpenAI Models}
 *
 * @category Providers
 * @category Provider: OpenAI
 *
 * @param {Object} params
 * @param {string} params.modelId - The model ID as defined by OpenAI.
 * @param {HttpClient} [params.client] - HTTP client to use for requests. If not supplied, the built-in fetch-based implementation will be used.
 * @param {OpenAiAuthConfig} [params.auth] - Authentication configuration for OpenAI. If not supplied, it will be loaded from the environment.
 * @returns {HttpModelProvider<OpenAiChatOptions, OpenAiChatResponse, BaseModelProviderConfig>} The OpenAI Model Provider with the {@link OpenAiChatApi}
 * @throws {Error} If no auth is passed and OPENAI_API_KEY is not found in process.env
 *
 * @example Usage
 * ```ts
 * import { createOpenAiChatModelProvider } from "generative-ts";
 *
 * const gpt = createOpenAiChatModelProvider({
 *   modelId: "gpt-4-turbo", // OpenAI defined model ID
 *   // you can explicitly pass auth here, otherwise by default it is read from process.env
 * });
 *
 * const response = await gpt.sendRequest({
 *   $prompt: "Brief History of NY Mets:",
 *   max_tokens: 100,
 *   // all other OpenAI ChatCompletion options available here
 * });
 *
 * console.log(response.choices[0]?.message.content);
 * ```
 */
export function createOpenAiChatModelProvider<
  THttpClientOptions = InferHttpClientOptions<HttpModelProvider>,
>({
  modelId,
  client,
  auth,
}: {
  modelId: string;
  client?: HttpClient<THttpClientOptions>;
  auth?: OpenAiAuthConfig;
}) {
  const { OPENAI_API_KEY } = auth ?? process.env;

  if (!OPENAI_API_KEY) {
    throw new Error(
      "Error when creating OpenAI-ChatCompletion ModelProvider: OpenAI API key (OPENAI_API_KEY) not found in process.env. Please either pass `OPENAI_API_KEY` explicitly in `auth` or set it in the environment.",
    );
  }

  return new HttpModelProvider({
    api: OpenAiChatApi,
    config: {
      modelId,
    },
    client,
    endpoint: "https://api.openai.com/v1/chat/completions",
    auth: new BearerTokenAuthStrategy(OPENAI_API_KEY),
  });
}
