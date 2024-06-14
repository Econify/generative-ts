import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

const templateSource = `{
  "inputText": "<%= prompt %>"
  <% if (typeof temperature !== 'undefined' || typeof topP !== 'undefined' || typeof maxTokenCount !== 'undefined' || typeof stopSequences !== 'undefined') { %>
  , "textGenerationConfig": {
    <% let comma = false; %>
    <% if (typeof temperature !== 'undefined') { %>
      "temperature": <%= temperature %>
      <% comma = true; %>
    <% } %>
    <% if (typeof topP !== 'undefined') { %>
      <% if (comma) { %>, <% } %> "topP": <%= topP %>
      <% comma = true; %>
    <% } %>
    <% if (typeof maxTokenCount !== 'undefined') { %>
      <% if (comma) { %>, <% } %> "maxTokenCount": <%= maxTokenCount %>
      <% comma = true; %>
    <% } %>
    <% if (typeof stopSequences !== 'undefined') { %>
      <% if (comma) { %>, <% } %> "stopSequences": <%- JSON.stringify(stopSequences) %>
    <% } %>
  }
  <% } %>
}`;

/**
 * @category Amazon Titan Text
 * @category Requests
 */
export interface AmazonTitanTextOptions extends ModelRequestOptions {
  temperature?: number; // float [0, 1.0]
  topP?: number; // float [1.00E-45, 1.0]
  maxTokenCount?: number; // int [0, 8000]
  stopSequences?: string[]; // must be one of: "|" | "User:"
}

/**
 * @category Amazon Titan Text
 * @category Templates
 */
export const AmazonTitanTextTemplate = new EjsTemplate<AmazonTitanTextOptions>(
  templateSource,
);

const AmazonTitanTextResponseCodec = t.type({
  inputTextTokenCount: t.number,
  results: t.array(
    t.type({
      outputText: t.string,
      completionReason: t.string,
      tokenCount: t.number,
    }),
  ),
});

/**
 * @category Amazon Titan Text
 * @category Responses
 */
export interface AmazonTitanTextResponse
  extends TypeOf<typeof AmazonTitanTextResponseCodec> {}

export function isAmazonTitanTextResponse(
  response: unknown,
): response is AmazonTitanTextResponse {
  return !isLeft(AmazonTitanTextResponseCodec.decode(response));
}

export interface AmazonTitanTextApi
  extends ModelApi<AmazonTitanTextOptions, AmazonTitanTextResponse> {}

/**
 *
 * ## Reference
 * [Amazon Titan Text](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-titan-text.html)
 *
 * ## Providers using this API
 * - {@link createAwsBedrockModelProvider | AWS Bedrock}
 *
 * @category APIs
 * @category Amazon Titan Text
 * @category Provider: AWS Bedrock
 *
 */
export const AmazonTitanTextApi: AmazonTitanTextApi = {
  requestTemplate: AmazonTitanTextTemplate,
  responseGuard: isAmazonTitanTextResponse,
};
