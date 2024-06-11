import type {
  HttpClient,
  InferRequestOptions,
  InferResponse,
  ModelApi,
} from "@typeDefs";

import type {
  HfConversationalTaskApi,
  HfTextGenerationTaskApi,
} from "../../apis";

import { BearerTokenAuthStrategy, HttpModelProvider } from "../http";

import type { HuggingfaceAuthConfig } from "./authConfig";

type HfApi = HfConversationalTaskApi | HfTextGenerationTaskApi;

/**
 *
 * Creates a Huggingface Inference {@link ModelProvider} with the specified {@link ModelApi}
 *
 * ```ts
 * import {
 *   createHuggingfaceInferenceModelProvider,
 *   HfTextGenerationTaskApi
 * } from "generative-ts";
 *
 * // Huggingface Inference supports many different APIs and models. See below for full list.
 * const gpt2 = createHuggingfaceInferenceModelProvider({
 *   api: HfTextGenerationTaskApi,
 *   modelId: "gpt2",
 *   // you can explicitly pass auth here, otherwise by default it is read from process.env
 * });
 *
 * const response = await gpt2.sendRequest({
 *   prompt: "Hello,"
 *   // all other options for the specified `api` available here
 * });
 *
 * console.log(response[0]?.generated_text);
 * ```
 *
 * ### Compatible APIs
 * - {@link HfConversationalTaskApi}
 * - {@link HfTextGenerationTaskApi}
 *
 * ### Provider Setup and Notes
 *
 * Create a Huggingface Inference API account at {@link https://huggingface.co/ | Huggingface}
 *
 * Obtain a {@link https://huggingface.co/settings/tokens | Huggingface User Access Token} and either pass it explicitly in `auth` or set it in the environment as `HUGGINGFACE_API_TOKEN`
 *
 * The Huggingface Inference API supports thousands of different models, grouped into "tasks". {@link https://huggingface.co/docs/api-inference/detailed_parameters | See the official documentation}.
 *
 * Currently we only ship API classes for {@link https://huggingface.co/docs/api-inference/detailed_parameters#conversational-task | Conversational Task} and {@link https://huggingface.co/docs/api-inference/detailed_parameters#text-generation-task | Text Generation Task}. If you need another task, you can create a new API and pass it as the `api` parameter.
 *
 * ### Model Parameters
 *
 * - {@link https://huggingface.co/docs/api-inference/detailed_parameters#conversational-task | Conversational Task}
 * - {@link https://huggingface.co/docs/api-inference/detailed_parameters#text-generation-task | Text Generation Task}
 *
 * ### Model IDs
 *
 * - {@link https://huggingface.co/models | Huggingface Models}
 *
 * @see {@link https://huggingface.co/settings/tokens | Huggingface User Access Token}
 * @see {@link https://huggingface.co/docs/api-inference/detailed_parameters | Huggingface Inference API}
 * @see {@link https://huggingface.co/models | Huggingface Models}
 *
 * @category Providers
 * @category Provider: Huggingface
 *
 * @param {Object} params
 * @param {HfApi} params.api - The API instance to use for making requests.
 * @param {string} params.modelId - The model ID as defined by Huggingface
 * @param {HttpClient} [params.client] - HTTP client to use for requests. If not supplied, the built-in fetch-based implementation will be used.
 * @param {HuggingfaceAuthConfig} [params.auth] - Authentication configuration for Huggingface. If not supplied, it will be loaded from the environment.
 * @returns {HttpModelProvider<TRequestOptions, TResponse, BaseModelProviderConfig>} The Huggingface Model Provider with the specified {@link ModelApi}.
 * @throws {Error} If no auth is passed and HUGGINGFACE_API_TOKEN is not found in process.env
 *
 * @example Usage
 * ```ts
 * import {
 *   createHuggingfaceInferenceModelProvider,
 *   HfTextGenerationTaskApi
 * } from "generative-ts";
 *
 * // Huggingface Inference supports many different APIs and models. See below for full list.
 * const gpt2 = createHuggingfaceInferenceModelProvider({
 *   api: HfTextGenerationTaskApi,
 *   modelId: "gpt2",
 *   // you can explicitly pass auth here, otherwise by default it is read from process.env
 * });
 *
 * const response = await gpt2.sendRequest({
 *   prompt: "Hello,"
 *   // all other options for the specified `api` available here
 * });
 *
 * console.log(response[0]?.generated_text);
 * ```
 */
export function createHuggingfaceInferenceModelProvider<THfApi extends HfApi>({
  api,
  modelId,
  client,
  auth,
}: {
  api: THfApi;
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
    api: api as ModelApi<InferRequestOptions<THfApi>, InferResponse<THfApi>>,
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
