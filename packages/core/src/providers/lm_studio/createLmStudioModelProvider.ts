import type { HttpClient } from "@typeDefs";

import { OpenAiChatApi } from "../../apis/openai";

import { HttpModelProvider } from "../http";

/**
 *
 * Creates a LMStudio {@link ModelProvider} with the {@link OpenAiChatApi}
 *
 * ```ts
import { createLmStudioModelProvider } from "generative-ts";

const llama3 = createLmStudioModelProvider({
  modelId: "lmstudio-community/Meta-Llama-3-70B-Instruct-GGUF",
});

const response = await llama3.sendRequest({ prompt: "Brief History of NY Mets:" });

console.log(response.choices[0]?.message.content);
 * ```
 *
 * @category Model Providers
 *
 * @param {Object} params
 * @param {string} params.modelId - The model ID for the LM Studio chat model.
 * @param {HttpClient} [params.client] - HTTP client to use for requests. If not supplied, the built-in fetch-based implementation will be used.
 * @param {string} [params.endpoint] - The endpoint URL for the LM Studio model. Defaults to "http://localhost:1234/v1/chat/completions".
 * @returns {HttpModelProvider<OpenAiChatOptions, OpenAiChatResponse, BaseModelProviderConfig>} The LM Studio Model Provider with the {@link OpenAiChatApi}
 *
 * @example Usage
 * ```ts
import { createLmStudioModelProvider } from "generative-ts";

const llama3 = createLmStudioModelProvider({
  modelId: "lmstudio-community/Meta-Llama-3-70B-Instruct-GGUF",
});

const response = await llama3.sendRequest({ prompt: "Brief History of NY Mets:" });

console.log(response.choices[0]?.message.content);
 * ```
 */
export function createLmStudioModelProvider({
  modelId,
  client,
  endpoint = "http://localhost:1234/v1/chat/completions",
}: {
  modelId: string;
  client?: HttpClient;
  endpoint?: string;
}) {
  return new HttpModelProvider({
    api: OpenAiChatApi,
    config: {
      modelId,
    },
    client,
    endpoint,
  });
}
