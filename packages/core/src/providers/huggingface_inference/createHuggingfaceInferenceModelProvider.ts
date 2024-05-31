import type { HttpClient, ModelApi } from "@typeDefs";

import type { HfInferenceApiOptions } from "../../apis/huggingface";

import { BearerTokenAuthStrategy, HttpModelProvider } from "../http";

import type { HuggingfaceAuthConfig } from "./authConfig";

/**
 *
 * Creates a Huggingface Inference {@link ModelProvider} with the specified {@link ModelApi} using {@link HfInferenceApiOptions}
 *
 * ```ts
 * import { createHuggingfaceInferenceModelProvider, HfTextGenerationTaskApi } from "generative-ts";
 *
 * const gpt2 = createHuggingfaceInferenceModelProvider({
 *   api: HfTextGenerationTaskApi,
 *   modelId: "gpt2",
 * });
 *
 * const response = await gpt2.sendRequest({ input: "Hello," });
 *
 * console.log(response[0]?.generated_text);
 * ```
 *
 * @category Providers
 * @category Provider: Huggingface
 *
 * @param {Object} params
 * @param {ModelApi<HfInferenceApiOptions, TResponse>} params.api - The Huggingface Inference API (must implement {@link HfInferenceApiOptions}), eg {@link HfTextGenerationTaskApi}
 * @param {string} params.modelId - The model ID as defined by Huggingface
 * @param {HttpClient} [params.client] - HTTP client to use for requests. If not supplied, the built-in fetch-based implementation will be used.
 * @param {HuggingfaceAuthConfig} [params.auth] - Authentication configuration for Huggingface. If not supplied, it will be loaded from the environment.
 * @returns {HttpModelProvider<TRequestOptions, TResponse, BaseModelProviderConfig>} The Huggingface Model Provider with the specified {@link ModelApi}.
 * @throws {Error} If no auth is passed and HUGGINGFACE_API_TOKEN is not found in process.env
 *
 * @example Usage
 * ```ts
 * import { createHuggingfaceInferenceModelProvider, HfTextGenerationTaskApi } from "generative-ts";
 *
 * const gpt2 = createHuggingfaceInferenceModelProvider({
 *   api: HfTextGenerationTaskApi,
 *   modelId: "gpt2",
 * });
 *
 * const response = await gpt2.sendRequest({ input: "Hello," });
 *
 * console.log(response[0]?.generated_text);
 * ```
 */
export function createHuggingfaceInferenceModelProvider<
  TRequestOptions extends HfInferenceApiOptions,
  TResponse = unknown,
>({
  api,
  modelId,
  client,
  auth,
}: {
  api: ModelApi<TRequestOptions, TResponse>;
  modelId: string;
  client?: HttpClient;
  auth?: HuggingfaceAuthConfig;
}) {
  const { HUGGINGFACE_API_TOKEN } = auth ?? process.env;

  if (!HUGGINGFACE_API_TOKEN) {
    throw new Error(
      "Error when creating Huggingface Inference ModelProvider: Huggingface Inference API token (HUGGINGFACE_API_TOKEN) not found in process.env. Please either pass `HUGGINGFACE_API_TOKEN` explicitly in `auth` or set it in the environment.",
    );
  }

  return new HttpModelProvider({
    api,
    config: {
      modelId,
    },
    client,
    endpoint: {
      getEndpoint({ modelId: mId }) {
        return `https://api-inference.huggingface.co/models/${mId}`;
      },
    },
    auth: new BearerTokenAuthStrategy(HUGGINGFACE_API_TOKEN),
  });
}
