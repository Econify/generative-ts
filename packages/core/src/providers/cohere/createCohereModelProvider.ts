import type {
  HttpClient,
  InferRequestOptions,
  InferResponse,
  ModelApi,
} from "@typeDefs";

import { CohereChatApi, CohereGenerateApi } from "../../apis";

import { BearerTokenAuthStrategy, HttpModelProvider } from "../http";

import type { CohereAuthConfig } from "./authConfig";

type CohereApi = CohereGenerateApi | CohereChatApi;

/**
 * Creates a Cohere {@link ModelProvider} with the {@link CohereChatApi} or legacy {@link CohereGenerateApi}
 *
 * ```ts
 * import { createCohereModelProvider } from "generative-ts";
 *
 * const commandR = createCohereModelProvider({
 *   modelId: "command-r-plus", // Cohere defined model ID
 *   // you can explicitly pass auth here, otherwise by default it is read from process.env
 * });
 *
 * const response = await commandR.sendRequest({
 *   prompt: "Brief History of NY Mets:",
 *   preamble: "Talk like Jafar from Aladdin",
 *   // all other Cohere /generate options available here
 * });
 *
 * console.log(response.text);
 * ```
 *
 * ### Compatible APIs
 * - {@link CohereChatApi} (default)
 * - {@link CohereGenerateApi}
 *
 * ### Provider Setup and Notes
 *
 * Create an API account at {@link https://cohere.com | Cohere}
 *
 * Obtain a {@link https://dashboard.cohere.com/api-keys | Cohere API key} and either pass them explicitly in `auth` or set them in the environment as `COHERE_API_KEY`
 *
 * By default, this will use the {@link https://docs.cohere.com/reference/chat | Cohere /chat API}. To use the {@link https://docs.cohere.com/reference/generate | Legacy Cohere /generate API} instead, pass {@link CohereGenerateApi} as the `api` parameter.
 *
 * ### Model Parameters
 *
 * - {@link https://docs.cohere.com/reference/chat | Cohere /chat API}
 * - {@link https://docs.cohere.com/reference/generate | Cohere /generate API}
 *
 * ### Model IDs
 *
 * - {@link https://docs.cohere.com/docs/models | Cohere Models}
 *
 * @see {@link https://dashboard.cohere.com/api-keys | Cohere API keys}
 * @see {@link https://docs.cohere.com/reference/chat | Cohere /chat API}
 * @see {@link https://docs.cohere.com/reference/generate | Cohere /generate API}
 * @see {@link https://docs.cohere.com/docs/models | Cohere Models}
 *
 * @category Providers
 * @category Provider: Cohere
 *
 * @param {Object} params
 * @param {CohereApi} [params.api] - The API instance to use for making requests. Defaults to {@link CohereChatApi}.
 * @param {string} params.modelId - The model ID as defined by Cohere.
 * @param {HttpClient} [params.client] - HTTP client to use for requests. If not supplied, the built-in fetch-based implementation will be used.
 * @param {CohereAuthConfig} [params.auth] - Authentication configuration for Cohere. If not supplied, it will be loaded from the environment.
 * @returns {HttpModelProvider} The Cohere Model Provider with the api specified by `params.api`
 * @throws {Error} If no auth is passed and COHERE_API_KEY is not found in process.env
 *
 * @example Usage
 * ```ts
 * import { createCohereModelProvider } from "generative-ts";
 *
 * const commandR = createCohereModelProvider({
 *   modelId: "command-r-plus", // Cohere defined model ID
 *   // you can explicitly pass auth here, otherwise by default it is read from process.env
 * });
 *
 * const response = await commandR.sendRequest({
 *   prompt: "Brief History of NY Mets:",
 *   preamble: "Talk like Jafar from Aladdin",
 *   // all other Cohere /generate options available here
 * });
 *
 * console.log(response.text);
 * ```
 *
 * @example Generate API
 * ```ts
 * import { createCohereModelProvider, CohereGenerateApi } from "generative-ts";
 *
 * const command = createCohereModelProvider({
 *   api: CohereGenerateApi,
 *   modelId: "command",
 * });
 *
 * const response = await command.sendRequest({
 *   prompt: "Brief History of NY Mets:",
 * });
 * ```
 */
export function createCohereModelProvider<
  TCohereApi extends CohereApi = CohereChatApi,
>({
  api = CohereChatApi as TCohereApi,
  modelId,
  client,
  auth,
}: {
  api?: TCohereApi;
  modelId: string;
  client?: HttpClient;
  auth?: CohereAuthConfig;
}) {
  const { COHERE_API_KEY } = auth ?? process.env;

  if (!COHERE_API_KEY) {
    throw new Error(
      "Error when creating Cohere ModelProvider: Cohere API key (COHERE_API_KEY) not found in process.env. Please either pass `COHERE_API_KEY` explicitly in `auth` or set it in the environment.",
    );
  }

  let endpoint;

  switch (api.name) {
    case CohereGenerateApi.name:
      endpoint = "https://api.cohere.ai/v1/generate";
      break;
    default:
      endpoint = "https://api.cohere.ai/v1/chat";
      break;
  }

  return new HttpModelProvider<
    InferRequestOptions<TCohereApi>,
    InferResponse<TCohereApi>
  >({
    api: api as ModelApi<
      InferRequestOptions<TCohereApi>,
      InferResponse<TCohereApi>
    >,
    config: {
      modelId,
    },
    client,
    endpoint,
    auth: new BearerTokenAuthStrategy(COHERE_API_KEY),
  });
}
