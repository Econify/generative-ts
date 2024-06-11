import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

const templateSource = `{
  "prompt": "<%= prompt %>"
  <% if (typeof num_generations !== 'undefined') { %>, "num_generations": <%= num_generations %><% } %>
  <% if (typeof stream !== 'undefined') { %>, "stream": <%= stream %><% } %>
  <% if (typeof max_tokens !== 'undefined') { %>, "max_tokens": <%= max_tokens %><% } %>
  <% if (typeof truncate !== 'undefined') { %>, "truncate": "<%= truncate %>"<% } %>
  <% if (typeof temperature !== 'undefined') { %>, "temperature": <%= temperature %><% } %>
  <% if (typeof seed !== 'undefined') { %>, "seed": <%= seed %><% } %>
  <% if (typeof preset !== 'undefined') { %>, "preset": "<%= preset %>"<% } %>
  <% if (typeof end_sequences !== 'undefined') { %>, "end_sequences": <%- JSON.stringify(end_sequences) %><% } %>
  <% if (typeof stop_sequences !== 'undefined') { %>, "stop_sequences": <%- JSON.stringify(stop_sequences) %><% } %>
  <% if (typeof k !== 'undefined') { %>, "k": <%= k %><% } %>
  <% if (typeof p !== 'undefined') { %>, "p": <%= p %><% } %>
  <% if (typeof frequency_penalty !== 'undefined') { %>, "frequency_penalty": <%= frequency_penalty %><% } %>
  <% if (typeof presence_penalty !== 'undefined') { %>, "presence_penalty": <%= presence_penalty %><% } %>
  <% if (typeof return_likelihoods !== 'undefined') { %>, "return_likelihoods": "<%= return_likelihoods %>"<% } %>
  <% if (typeof logit_bias !== 'undefined') { %>, "logit_bias": <%- JSON.stringify(logit_bias) %><% } %>
}`;

/**
 * @category Requests
 * @category Cohere Generate
 */
export interface CohereGenerateOptions extends ModelRequestOptions {
  num_generations?: number;
  stream?: boolean;
  max_tokens?: number;
  truncate?: "NONE" | "START" | "END";
  temperature?: number;
  seed?: number;
  preset?: string;
  end_sequences?: string[];
  stop_sequences?: string[];
  k?: number;
  p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  return_likelihoods?: "GENERATION" | "ALL" | "NONE";
  logit_bias?: { [token_id: number]: number }; // on bedrock but not cohere /generate?
}

/**
 * @category Templates
 * @category Cohere Generate
 */
export const CohereGenerateTemplate = new EjsTemplate<CohereGenerateOptions>(
  templateSource,
);

const CohereGenerateResponseCodec = t.intersection([
  t.type({
    id: t.string,
    prompt: t.string,
    generations: t.array(
      t.type({
        id: t.string,
        text: t.string,
        finish_reason: t.string,
      }),
    ),
  }),
  t.partial({
    meta: t.type({
      api_version: t.type({
        version: t.string,
      }),
      billed_units: t.type({
        input_tokens: t.number,
        output_tokens: t.number,
      }),
    }),
  }),
]);

/**
 * @category Responses
 * @category Cohere Generate
 */
export interface CohereGenerateResponse
  extends TypeOf<typeof CohereGenerateResponseCodec> {}

export function isCohereGenerateResponse(
  response: unknown,
): response is CohereGenerateResponse {
  return !isLeft(CohereGenerateResponseCodec.decode(response));
}

export interface CohereGenerateApi
  extends ModelApi<CohereGenerateOptions, CohereGenerateResponse> {}

/**
 *
 * ## Reference
 * [Cohere Generate](https://docs.cohere.com/reference/generate)
 *
 * ## Providers using this API
 * - {@link createCohereModelProvider | Cohere}
 * - {@link createAwsBedrockModelProvider | AWS Bedrock}
 *
 * @category APIs
 * @category Cohere Generate
 * @category Provider: AWS Bedrock
 * @category Provider: Cohere
 *
 */
export const CohereGenerateApi: CohereGenerateApi = {
  requestTemplate: CohereGenerateTemplate,
  responseGuard: isCohereGenerateResponse,
  name: "COHERE-GENERATE",
};
