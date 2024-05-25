import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../../typeDefs";

import { Template } from "../../utils/template";

const templateSource = `{
  "prompt": "<%= prompt %>"
  <% if (typeof temperature !== 'undefined') { %>
    , "temperature": <%= temperature %>
  <% } %>
  <% if (typeof p !== 'undefined') { %>
    , "p": <%= p %>
  <% } %>
  <% if (typeof k !== 'undefined') { %>
    , "k": <%= k %>
  <% } %>
  <% if (typeof max_tokens !== 'undefined') { %>
    , "max_tokens": <%= max_tokens %>
  <% } %>
  <% if (typeof stop_sequences !== 'undefined') { %>
    , "stop_sequences": [<%= stop_sequences.join(', ') %>]
  <% } %>
  <% if (typeof return_likelihoods !== 'undefined') { %>
    , "return_likelihoods": "<%= return_likelihoods %>"
  <% } %>
  <% if (typeof stream !== 'undefined') { %>
    , "stream": <%= stream %>
  <% } %>
  <% if (typeof num_generations !== 'undefined') { %>
    , "num_generations": <%= num_generations %>
  <% } %>
  <% if (typeof logit_bias !== 'undefined') { %>
    , "logit_bias": <%= JSON.stringify(logit_bias) %>
  <% } %>
  <% if (typeof truncate !== 'undefined') { %>
    , "truncate": "<%= truncate %>"
  <% } %>
}`;

export interface CohereGenerateOptions extends ModelRequestOptions {
  num_generations?: number;
  stream?: boolean;
  max_tokens?: number;
  truncate?: "NONE" | "START" | "END";
  temperature?: number;
  // seed ?
  // preset ?
  // end_sequences ?
  stop_sequences?: string[];
  k?: number;
  p?: number;
  // frequency_penalty ?
  // presence_penalty ?
  return_likelihoods?: "GENERATION" | "ALL" | "NONE";
  logit_bias?: { [token_id: number]: number }; // on bedrock but not cohere /generate?
}

export const CohereGenerateTemplate = new Template<CohereGenerateOptions>(
  templateSource,
);

const CohereGenerateResponseCodec = t.type({
  id: t.string,
  prompt: t.string,
  generations: t.array(
    t.type({
      id: t.string,
      text: t.string,
      finish_reason: t.string, // COMPLETE | MAX_TOKENS | ERROR | ERROR_TOXIC
      // index ?
      // likelihood ?
      // token_likelihoods ?
    }),
  ),
});

export type CohereGenerateResponse = TypeOf<typeof CohereGenerateResponseCodec>;

export function isCohereGenerateResponse(
  response: unknown,
): response is CohereGenerateResponse {
  return !isLeft(CohereGenerateResponseCodec.decode(response));
}

export const CohereGenerateApi: ModelApi<
  CohereGenerateOptions,
  CohereGenerateResponse
> = {
  requestTemplate: CohereGenerateTemplate,
  responseGuard: isCohereGenerateResponse,
};
