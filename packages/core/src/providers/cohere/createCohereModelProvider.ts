import type {
  HttpClient,
  InferRequestOptions,
  InferResponse,
  ModelApi,
} from "@typeDefs";

import { CohereChatApi, CohereGenerateApi } from "../../apis/cohere";

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
 *   modelId: "command-r-plus",
 * });
 *
 * const response = await commandR.sendRequest({
 *   prompt: "Brief History of NY Mets:",
 *   preamble: "Talk like Jafar from Aladdin",
 * });
 * ```
 *
 * ### Compatible APIs
 * - {@link CohereChatApi} (default)
 * - {@link CohereGenerateApi}
 *
 * @see {@link https://docs.cohere.com/reference/chat | Cohere Chat}
 * @see {@link https://docs.cohere.com/reference/generate | Cohere Generate}
 *
 * @category Providers
 * @category Provider: Cohere
 *
 * @param {Object} params
 * @param {CohereGenerateApi | CohereChatApi} [params.api] - The API to use for the provider. Defaults to {@link CohereChatApi}.
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
 *   modelId: "command-r-plus",
 * });
 *
 * const response = await commandR.sendRequest({
 *   prompt: "Brief History of NY Mets:",
 *   preamble: "Talk like Jafar from Aladdin",
 * });
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
