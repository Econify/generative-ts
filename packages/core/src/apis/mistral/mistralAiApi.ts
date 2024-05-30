import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

import type { FewShotRequestOptions } from "../_shared_interfaces/fewShot";

const templateSource = `{
  "model": "<%= modelId %>",
  "messages": [
    <% if (typeof system !== 'undefined') { %>
    {
      "role": "system",
      "content": "<%= system %>"
    },
    <% } %>
    <% (typeof examplePairs !== 'undefined' ? examplePairs : []).forEach(pair => { %>
    {
      "role": "user",
      "content": "<%= pair.user %>"
    },
    {
      "role": "assistant",
      "content": "<%= pair.assistant %>"
    },
    <% }) %>
    <% (typeof messages !== 'undefined' ? messages : []).forEach(message => { %>
    {
      "role": "<%= message.role %>",
      "content": "<%= message.content %>"
    },
    <% }) %>
    {
      "role": "user",
      "content": "<%= prompt %>"
    }
  ]
  <% if (typeof temperature !== 'undefined') { %>, "temperature": <%= temperature %><% } %>
  <% if (typeof top_p !== 'undefined') { %>, "top_p": <%= top_p %><% } %>
  <% if (typeof max_tokens !== 'undefined') { %>, "max_tokens": <%= max_tokens %><% } %>
  <% if (typeof stream !== 'undefined') { %>, "stream": <%= stream %><% } %>
  <% if (typeof safe_prompt !== 'undefined') { %>, "safe_prompt": <%= safe_prompt %><% } %>
  <% if (typeof random_seed !== 'undefined') { %>, "seed": <%= seed %><% } %>
}`;

/**
 * @category Mistral
 * @category Requests
 */
export interface MistralAiOptions
  extends FewShotRequestOptions,
    ModelRequestOptions {
  messages?: {
    role: "user" | "assistant" | "system";
    content: string;
  }[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  safe_prompt?: boolean;
  random_seed?: number;
}

/**
 * @category Mistral
 * @category Templates
 */
export const MistralAiTemplate = new EjsTemplate<MistralAiOptions>(
  templateSource,
);

const MistralAiApiResponseCodec = t.type({
  id: t.string,
});

/**
 * @category Mistral
 * @category Responses
 */
export interface MistralAiResponse
  extends TypeOf<typeof MistralAiApiResponseCodec> {}

export function isMistralAiResponse(
  response: unknown,
): response is MistralAiResponse {
  return !isLeft(MistralAiApiResponseCodec.decode(response));
}

/**
 * Mistral Chat Completion API (https://docs.mistral.ai/api/#operation/createChatCompletion)
 *
 * @category Mistral
 * @category APIs
 * @type {ModelApi<MistralAiOptions, MistralAiResponse>}
 */
export const MistralAiApi: ModelApi<MistralAiOptions, MistralAiResponse> = {
  requestTemplate: MistralAiTemplate,
  responseGuard: isMistralAiResponse,
};
