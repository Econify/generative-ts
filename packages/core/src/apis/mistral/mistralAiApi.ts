import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../../typeDefs";

import { Template } from "../../utils/template";

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

export interface MistralAiApiOptions
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

export const MistralAiApiTemplate = new Template<MistralAiApiOptions>(
  templateSource,
);

const MistralAiApiResponseCodec = t.type({
  id: t.string,
});

export type MistralAiApiResponse = TypeOf<typeof MistralAiApiResponseCodec>;

export function isMistralAiApiResponse(
  response: unknown,
): response is MistralAiApiResponse {
  return !isLeft(MistralAiApiResponseCodec.decode(response));
}

export const MistralAiApi: ModelApi<MistralAiApiOptions, MistralAiApiResponse> =
  {
    requestTemplate: MistralAiApiTemplate,
    responseGuard: isMistralAiApiResponse,
  };
