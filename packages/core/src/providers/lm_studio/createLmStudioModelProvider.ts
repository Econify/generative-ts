import type { HttpClient } from "@typeDefs";

import { OpenAiChatApi } from "../../apis/openai";

import { HttpModelProvider, InferHttpClientOptions } from "../http";

/**
 *
 * Creates a LMStudio {@link ModelProvider} with the {@link OpenAiChatApi}
 *
 * ```ts
 * import { createLmStudioModelProvider } from "generative-ts";
 *
 * const llama3 = createLmStudioModelProvider({
 *   modelId: "lmstudio-community/Meta-Llama-3-70B-Instruct-GGUF", // a ID of a model you have downloaded in LMStudio
 * });
 *
 * const response = await llama3.sendRequest({
 *   prompt: "Brief History of NY Mets:"
 *   // all other OpenAI ChatCompletion options available here (LMStudio uses the OpenAI ChatCompletion API for all the models it hosts)
 * });
 *
 * console.log(response.choices[0]?.message.content);
 * ```
 *
 * ### Provider Setup and Notes
 *
 * Follow {@link https://lmstudio.ai/docs/local-server#using-the-local-server | LMStudio's instructions} to set up the LMStudio local server.
 *
 * LMStudio uses the {@link https://platform.openai.com/docs/api-reference/chat/create | OpenAI ChatCompletion API} for all the models it hosts.
 *
 * ### Model Parameters
 *
 * - {@link https://platform.openai.com/docs/api-reference/chat/create | OpenAI ChatCompletion API}
 *
 * ### Model IDs
 *
 * - The model ID can be found in LMStudio, listed as the "name" of the model.
 *
 * @see {@link https://lmstudio.ai/docs | LMStudio Documentation}
 * @see {@link https://platform.openai.com/docs/api-reference/chat/create | OpenAI ChatCompletion API}
 *
 * @category Providers
 * @category Provider: LMStudio
 *
 * @param {Object} params
 * @param {string} params.modelId - The model ID as defined by LMStudio. You must have downloaded this within LMStudio. If no matching model exists, LMStudio will silently use the first loaded model.
 * @param {HttpClient} [params.client] - HTTP client to use for requests. If not supplied, the built-in fetch-based implementation will be used.
 * @param {string} [params.endpoint] - The endpoint URL for the LM Studio model. Defaults to "http://localhost:1234/v1/chat/completions".
 * @returns {HttpModelProvider<OpenAiChatOptions, OpenAiChatResponse, BaseModelProviderConfig>} The LM Studio Model Provider with the {@link OpenAiChatApi}
 *
 * @example Usage
 * ```ts
 * import { createLmStudioModelProvider } from "generative-ts";
 *
 * const llama3 = createLmStudioModelProvider({
 *   modelId: "lmstudio-community/Meta-Llama-3-70B-Instruct-GGUF", // a ID of a model you have downloaded in LMStudio
 * });
 *
 * const response = await llama3.sendRequest({
 *   prompt: "Brief History of NY Mets:"
 *   // all other OpenAI ChatCompletion options available here (LMStudio uses the OpenAI ChatCompletion API for all the models it hosts)
 * });
 *
 * console.log(response.choices[0]?.message.content);
 * ```
 */
export function createLmStudioModelProvider<
  THttpClientOptions = InferHttpClientOptions<HttpModelProvider>,
>({
  modelId,
  client,
  endpoint = "http://localhost:1234/v1/chat/completions",
}: {
  modelId: string;
  client?: HttpClient<THttpClientOptions>;
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
