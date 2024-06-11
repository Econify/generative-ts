import type { HttpClient } from "@generative-ts/core";

import {
  BearerTokenAuthStrategy,
  HttpModelProvider,
  OpenAiChatApi,
} from "@generative-ts/core";

/**
 *
 * Creates a TODO
 *
 * ```ts
 * # TODO
 * ```
 *
 * ### Provider Setup and Notes
 *
 * TODO
 *
 * ### Model Parameters
 *
 * - TODO
 *
 * ### Model IDs
 *
 * - TODO
 *
 * @category Providers
 * @category Provider: Google VertexAI
 *
 * @param {Object} params
 *
 * @example Usage
 * ```ts
 * # TODO
 * ```
 */
export function createVertexAiModelProvider({
  modelId,
  client,
  // auth,
}: {
  modelId: string;
  client?: HttpClient;
  // auth?: VertexAiAuthConfig;
}) {
  // TODO auth

  return new HttpModelProvider({
    api: OpenAiChatApi,
    config: {
      modelId,
    },
    client,
    endpoint: "",
    auth: new BearerTokenAuthStrategy(""),
  });
}
