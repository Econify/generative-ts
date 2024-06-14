import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

import type { FewShotRequestOptions } from "../shared";

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
 * @category Requests
 * @category Mistral Bedrock
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
 * @category Templates
 * @category Mistral Bedrock
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
 * @category Responses
 * @category Mistral Bedrock
 */
export interface MistralBedrockResponse
  extends TypeOf<typeof MistralBedrockResponseCodec> {}

export function isMistralBedrockResponse(
  response: unknown,
): response is MistralBedrockResponse {
  return !isLeft(MistralBedrockResponseCodec.decode(response));
}

export interface MistralBedrockApi
  extends ModelApi<MistralBedrockOptions, MistralBedrockResponse> {}

/**
 *
 * ## Reference
 * [Mistral on AWS Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-mistral.html)
 *
 * ## Providers using this API
 * - {@link createAwsBedrockModelProvider | AWS Bedrock}
 *
 * @category APIs
 * @category Mistral Bedrock
 * @category Provider: AWS Bedrock
 *
 */
export const MistralBedrockApi: MistralBedrockApi = {
  requestTemplate: MistralBedrockTemplate,
  responseGuard: isMistralBedrockResponse,
};
