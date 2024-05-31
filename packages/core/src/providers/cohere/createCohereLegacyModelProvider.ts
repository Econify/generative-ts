import type { HttpClient } from "@typeDefs";

import { CohereGenerateApi } from "../../apis/cohere";

import { BearerTokenAuthStrategy } from "../http/strategies";

import { HttpModelProvider } from "../http";

import type { CohereAuthConfig } from "./authConfig";

/**
 * Creates a Cohere {@link ModelProvider} with the {@link CohereGenerateApi}
 *
 * ```ts
 * import { createCohereLegacyModelProvider } from "generative-ts";
 *
 * const cohereCommand = createCohereLegacyModelProvider({
 *   modelId: "command",
 * });
 *
 * const response = await cohereCommand.sendRequest({ prompt: "Brief History of NY Mets:" });
 *
 * console.log(response.generations[0]?.text);
 * ```
 *
 * @category Providers
 * @category Provider: Cohere
 *
 * @param {Object} params
 * @param {string} params.modelId - The model ID as defined by Cohere.
 * @param {HttpClient} [params.client] - HTTP client to use for requests. If not supplied, the built-in fetch-based implementation will be used.
 * @param {CohereAuthConfig} [params.auth] - Authentication configuration for Cohere. If not supplied, it will be loaded from the environment.
 * @returns {HttpModelProvider<CohereGenerateOptions, CohereGenerateResponse, BaseModelProviderConfig>} The Cohere Model Provider with the {@link CohereGenerateApi}
 * @throws {Error} If no auth is passed and COHERE_API_KEY is not found in process.env
 *
 * @example Usage
 * ```ts
 * import { createCohereLegacyModelProvider } from "generative-ts";
 *
 * const cohereCommand = createCohereLegacyModelProvider({
 *   modelId: "command",
 * });
 *
 * const response = await cohereCommand.sendRequest({ prompt: "Brief History of NY Mets:" });
 *
 * console.log(response.generations[0]?.text);
 * ```
 */
export function createCohereLegacyModelProvider({
  modelId,
  client,
  auth,
}: {
  modelId: string;
  client?: HttpClient;
  auth?: CohereAuthConfig;
}) {
  const { COHERE_API_KEY } = auth ?? process.env;

  if (!COHERE_API_KEY) {
    throw new Error(
      "Error when creating Cohere-Generate ModelProvider: Cohere API key (COHERE_API_KEY) not found in process.env. Please either pass `COHERE_API_KEY` explicitly in `auth` or set it in the environment.",
    );
  }

  return new HttpModelProvider({
    api: CohereGenerateApi,
    config: {
      modelId,
    },
    client,
    endpoint: "https://api.cohere.ai/v1/generate",
    auth: new BearerTokenAuthStrategy(COHERE_API_KEY),
  });
}
