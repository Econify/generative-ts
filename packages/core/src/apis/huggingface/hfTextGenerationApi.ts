import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

import { HfInferenceApiOptions } from "./hfInferenceApi";

const templateSource = `{
  "inputs": "<%= prompt %>"
  <% if (typeof parameters !== 'undefined') { %>
  , "parameters": {
    <% let comma = false; %>
    <% if (typeof parameters.top_k !== 'undefined') { %>"top_k": <%= parameters.top_k %><% comma = true; %><% } %>
    <% if (typeof parameters.top_p !== 'undefined') { %><% if (comma) { %>, <% } %>"top_p": <%= parameters.top_p %><% comma = true; %><% } %>
    <% if (typeof parameters.temperature !== 'undefined') { %><% if (comma) { %>, <% } %>"temperature": <%= parameters.temperature %><% comma = true; %><% } %>
    <% if (typeof parameters.repetition_penalty !== 'undefined') { %><% if (comma) { %>, <% } %>"repetition_penalty": <%= parameters.repetition_penalty %><% comma = true; %><% } %>
    <% if (typeof parameters.max_new_tokens !== 'undefined') { %><% if (comma) { %>, <% } %>"max_new_tokens": <%= parameters.max_new_tokens %><% comma = true; %><% } %>
    <% if (typeof parameters.max_time !== 'undefined') { %><% if (comma) { %>, <% } %>"max_time": <%= parameters.max_time %><% comma = true; %><% } %>
    <% if (typeof parameters.return_full_text !== 'undefined') { %><% if (comma) { %>, <% } %>"return_full_text": <%= parameters.return_full_text %><% comma = true; %><% } %>
    <% if (typeof parameters.num_return_sequences !== 'undefined') { %><% if (comma) { %>, <% } %>"num_return_sequences": <%= parameters.num_return_sequences %><% comma = true; %><% } %>
    <% if (typeof parameters.do_sample !== 'undefined') { %><% if (comma) { %>, <% } %>"do_sample": <%= parameters.do_sample %><% } %>
  }
  <% } %>
  <% if (typeof options !== 'undefined') { %>
  , "options": {
    <% let commaOptions = false; %>
    <% if (typeof options.use_cache !== 'undefined') { %>"use_cache": <%= options.use_cache %><% commaOptions = true; %><% } %>
    <% if (typeof options.wait_for_model !== 'undefined') { %><% if (commaOptions) { %>, <% } %>"wait_for_model": <%= options.wait_for_model %><% } %>
  }
  <% } %>
}`;

/**
 * @category Requests
 * @category Huggingface Text Generation Task
 */
export interface HfTextGenerationTaskOptions extends HfInferenceApiOptions {
  parameters?: {
    top_k?: number;
    top_p?: number;
    temperature?: number;
    repetition_penalty?: number;
    max_new_tokens?: number;
    max_time?: number;
    return_full_text?: boolean;
    num_return_sequences?: number;
    do_sample?: boolean;
  };
}

/**
 * @category Templates
 * @category Huggingface Text Generation Task
 */
export const HfTextGenerationTaskTemplate =
  new EjsTemplate<HfTextGenerationTaskOptions>(templateSource);

const HfTextGenerationTaskResponseCodec = t.array(
  t.type({
    generated_text: t.string,
  }),
);

/**
 * @category Responses
 * @category Huggingface Text Generation Task
 */
export interface HfTextGenerationTaskResponse
  extends TypeOf<typeof HfTextGenerationTaskResponseCodec> {}

export function isHfTextGenerationTaskResponse(
  response: unknown,
): response is HfTextGenerationTaskResponse {
  return !isLeft(HfTextGenerationTaskResponseCodec.decode(response));
}

export interface HfTextGenerationTaskApi
  extends ModelApi<HfTextGenerationTaskOptions, HfTextGenerationTaskResponse> {}

/**
 *
 * ## Reference
 * [Huggingface Text Generation Task](https://huggingface.co/docs/api-inference/detailed_parameters?code=curl#text-generation-task)
 *
 * ## Providers using this API
 * - {@link createHuggingfaceInferenceModelProvider | Huggingface Inference API}
 *
 * @category APIs
 * @category Provider: Huggingface
 * @category Huggingface Text Generation Task
 */
export const HfTextGenerationTaskApi: HfTextGenerationTaskApi = {
  requestTemplate: HfTextGenerationTaskTemplate,
  responseGuard: isHfTextGenerationTaskResponse,
};
