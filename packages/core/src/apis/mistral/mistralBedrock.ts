import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../../typeDefs";

import { Template } from "../../utils/template";

import type { FewShotRequestOptions } from "../_shared_interfaces/fewShot";

import { Llama2ChatMlTemplateSource } from "../meta/llama2ChatApi";

const templateSource = `{
  "prompt": "${Llama2ChatMlTemplateSource}"
  <% if (typeof max_tokens !== 'undefined') { %>, "max_tokens": <%= max_tokens %><% } %>
  <% if (typeof stop !== 'undefined') { %>, "stop": [<%= stop.join(', ') %>]<% } %>
  <% if (typeof temperature !== 'undefined') { %>, "temperature": <%= temperature %><% } %>
  <% if (typeof top_p !== 'undefined') { %>, "top_p": <%= top_p %><% } %>
  <% if (typeof top_k !== 'undefined') { %>, "top_k": <%= top_k %><% } %>  
}`;

export interface MistralBedrockOptions
  extends FewShotRequestOptions,
    ModelRequestOptions {
  max_tokens?: number;
  stop?: string[];
  temperature?: number;
  top_p?: number;
  top_k?: number;
}

export const MistralBedrockTemplate = new Template<MistralBedrockOptions>(
  templateSource,
);

const MistralBedrockResponseCodec = t.type({
  outputs: t.array(
    t.type({
      text: t.string,
      stop_reason: t.string,
    }),
  ),
});

export type MistralBedrockResponse = TypeOf<typeof MistralBedrockResponseCodec>;

export function isMistralBedrockResponse(
  response: unknown,
): response is MistralBedrockResponse {
  return !isLeft(MistralBedrockResponseCodec.decode(response));
}

export const MistralBedrockApi: ModelApi<
  MistralBedrockOptions,
  MistralBedrockResponse
> = {
  requestTemplate: MistralBedrockTemplate,
  responseGuard: isMistralBedrockResponse,
};
