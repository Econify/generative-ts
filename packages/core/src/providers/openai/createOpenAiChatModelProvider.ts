import type { HttpClient } from "@typeDefs";

import { OpenAiChatApi } from "../../apis/openai";

import { BearerTokenAuthStrategy } from "../http/strategies";

import { HttpModelProvider } from "../http";

import { loadAuthConfig, OpenAiAuthConfig } from "./loadAuthConfig";

/**
 *
 * The OpenAI Model Provider with the {@link OpenAiChatApi}
 * ```ts
import { createOpenAiChatModelProvider } from "generative-ts";

const gpt4 = createOpenAiChatModelProvider({
  modelId: "gpt-4-turbo",
});

const response = await gptProvider.sendRequest({ prompt: "Brief History of NY Mets:" });

console.log(response.choices[0]?.message.content);
 * ```
 * @category Model Providers
 *
 * @param {Object} params
 * @param {string} params.modelId - The model ID for the OpenAI chat model.
 * @param {HttpClient} [params.client] - HTTP client to use for requests. If not supplied, the built-in fetch-based implementation will be used.
 * @param {OpenAiAuthConfig} [params.auth] - Authentication configuration for OpenAI. If not supplied, it will be loaded from the environment.
 * @returns {HttpModelProvider<OpenAiChatOptions, OpenAiChatResponse, BaseModelProviderConfig>} The OpenAI Model Provider with the {@link OpenAiChatApi}
 * @throws {Error} If no auth is passed and OPENAI_API_KEY is not found in process.env
 *
 * @example Usage
 * ```ts
import { createOpenAiChatModelProvider } from "generative-ts";

const gpt4 = createOpenAiChatModelProvider({
  modelId: "gpt-4-turbo",
});

const response = await gptProvider.sendRequest({ prompt: "Brief History of NY Mets:" });

console.log(response.choices[0]?.message.content);
 * ```
 */
export function createOpenAiChatModelProvider({
  modelId,
  client,
  auth,
}: {
  modelId: string;
  client?: HttpClient;
  auth?: OpenAiAuthConfig;
}) {
  const { OPENAI_API_KEY } = auth ?? loadAuthConfig();

  // TODO throw error if no key ("auth must be passed or OPENAI_API_KEY must be set in process.env")

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
