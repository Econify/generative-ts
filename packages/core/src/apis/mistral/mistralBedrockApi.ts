import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

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

/**
 * @category Mistral (AWS Bedrock)
 * @category Requests
 */
export interface MistralBedrockOptions
  extends FewShotRequestOptions,
    ModelRequestOptions {
  max_tokens?: number;
  stop?: string[];
  temperature?: number;
  top_p?: number;
  top_k?: number;
}

/**
 * @category Mistral (AWS Bedrock)
 * @category Templates
 */
export const MistralBedrockTemplate = new EjsTemplate<MistralBedrockOptions>(
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

/**
 * @category Mistral (AWS Bedrock)
 * @category Responses
 */
export interface MistralBedrockResponse
  extends TypeOf<typeof MistralBedrockResponseCodec> {}

export function isMistralBedrockResponse(
  response: unknown,
): response is MistralBedrockResponse {
  return !isLeft(MistralBedrockResponseCodec.decode(response));
}

/**
 * Mistral on AWS Bedrock API (https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-mistral.html)
 * This API is specific to Mistral on AWS Bedrockl. It is different than the one offered by Mistral directly.
 *
 * @category Mistral (AWS Bedrock)
 * @category APIs
 * @type {ModelApi<MistralAiOptions, MistralAiResponse>}
 */
export const MistralBedrockApi: ModelApi<
  MistralBedrockOptions,
  MistralBedrockResponse
> = {
  requestTemplate: MistralBedrockTemplate,
  responseGuard: isMistralBedrockResponse,
};
