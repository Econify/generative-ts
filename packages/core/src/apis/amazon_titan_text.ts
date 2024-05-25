import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../typeDefs";

import { Template } from "../utils/template";

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
      <% if (comma) { %>, <% } %> "stopSequences": [<%= stopSequences.join(', ') %>]
    <% } %>
  }
  <% } %>
}`;

export interface AmazonTitanTextOptions extends ModelRequestOptions {
  temperature?: number; // float [0, 1.0]
  topP?: number; // float [1.00E-45, 1.0]
  maxTokenCount?: number; // int [0, 8000]
  stopSequences?: string[]; // must be one of: "|" | "User:"
}

export const AmazonTitanTextTemplate = new Template<AmazonTitanTextOptions>(
  templateSource,
);

const AmazonTitanTextResponseCodec = t.type({
  results: t.array(
    t.type({
      outputText: t.string,
      // TODO...
    }),
  ),
});

export type AmazonTitanTextResponse = TypeOf<
  typeof AmazonTitanTextResponseCodec
>;

export function isAmazonTitanTextResponse(
  response: unknown,
): response is AmazonTitanTextResponse {
  return !isLeft(AmazonTitanTextResponseCodec.decode(response));
}

export const AmazonTitanTextApi: ModelApi<
  AmazonTitanTextOptions,
  AmazonTitanTextResponse
> = {
  requestTemplate: AmazonTitanTextTemplate,
  responseGuard: isAmazonTitanTextResponse,
};
