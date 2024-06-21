import type { HttpClient } from "@typeDefs";

import { MistralAiApi } from "../../apis/mistral";

import { BearerTokenAuthStrategy } from "../http/strategies";

import { HttpModelProvider, InferHttpClientOptions } from "../http";

import type { MistralAuthConfig } from "./authConfig";

/**
 * Creates a Mistral {@link ModelProvider} with the {@link MistralAiApi}
 *
 * ```ts
 * import { createMistralModelProvider } from "generative-ts";
 *
 * const mistralLarge = createMistralModelProvider({
 *   modelId: "mistral-large-latest", // Mistral defined model ID
 *   // you can explicitly pass auth here, otherwise by default it is read from process.env
 * });
 *
 * const response = await mistralLarge.sendRequest({
 *   $prompt: "Brief History of NY Mets:"
 *   // all other Mistral ChatCompletion API options available here
 * });
 *
 * console.log(response.choices[0]?.message.content);
 * ```
 *
 * ### Provider Setup and Notes
 *
 * Create an API account at {@link https://mistral.ai | Mistral}
 *
 * Obtain a {@link https://console.mistral.ai/api-keys/ | Mistral API key} and either pass them explicitly in `auth` or set them in the environment as `MISTRAL_API_KEY`
 *
 * ### Model Parameters
 *
 * - {@link https://docs.mistral.ai/api/#operation/createChatCompletion | Mistral ChatCompletion API}
 *
 * ### Model IDs
 *
 * - {@link https://docs.mistral.ai/getting-started/models/ | Mistral Models}
 *
 * @see {@link https://console.mistral.ai/api-keys/ | Mistral API keys}
 * @see {@link https://docs.mistral.ai/api/#operation/createChatCompletion | Mistral ChatCompletion API}
 * @see {@link https://docs.mistral.ai/getting-started/models/ | Mistral Models}
 *
 * @category Providers
 * @category Provider: Mistral
 *
 * @param {Object} params
 * @param {string} params.modelId - The model ID as defined by Mistral.
 * @param {HttpClient} [params.client] - HTTP client to use for requests. If not supplied, the built-in fetch-based implementation will be used.
 * @param {MistralAuthConfig} [params.auth] - Authentication configuration for Mistral. If not supplied, it will be loaded from the environment.
 * @returns {HttpModelProvider<MistralGenerateOptions, MistralGenerateResponse, BaseModelProviderConfig>} The Mistral Model Provider with the {@link MistralAiApi}
 * @throws {Error} If no auth is passed and MISTRAL_API_KEY is not found in process.env
 *
 * @example Usage
 * ```ts
 * import { createMistralModelProvider } from "generative-ts";
 *
 * const mistralLarge = createMistralModelProvider({
 *   modelId: "mistral-large-latest", // Mistral defined model ID
 *   // you can explicitly pass auth here, otherwise by default it is read from process.env
 * });
 *
 * const response = await mistralLarge.sendRequest({
 *   $prompt: "Brief History of NY Mets:"
 *   // all other Mistral ChatCompletion API options available here
 * });
 *
 * console.log(response.choices[0]?.message.content);
 * ```
 */
export function createMistralModelProvider<
  THttpClientOptions = InferHttpClientOptions<HttpModelProvider>,
>({
  modelId,
  client,
  auth,
}: {
  modelId: string;
  client?: HttpClient<THttpClientOptions>;
  auth?: MistralAuthConfig;
}) {
  const { MISTRAL_API_KEY } = auth ?? process.env;

  if (!MISTRAL_API_KEY) {
    throw new Error(
      "Error when creating Mistral ModelProvider: Mistral API key (MISTRAL_API_KEY) not found in process.env. Please either pass `MISTRAL_API_TOKEN` explicitly in `auth` or set it in the environment.",
    );
  }

  return new HttpModelProvider({
    api: MistralAiApi,
    config: {
      modelId,
    },
    client,
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    auth: new BearerTokenAuthStrategy(MISTRAL_API_KEY),
  });
}
