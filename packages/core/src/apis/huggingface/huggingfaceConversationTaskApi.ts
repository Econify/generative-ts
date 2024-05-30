import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";
import { EjsTemplate } from "../../utils/ejsTemplate";

const templateSource = `{
  "inputs": "<%= prompt %>"
  <% if (typeof past_user_inputs !== 'undefined' && past_user_inputs.length > 0) { %>
    , "past_user_inputs": <%- JSON.stringify(past_user_inputs) %>
  <% } %>
  <% if (typeof generated_responses !== 'undefined' && generated_responses.length > 0) { %>
    , "generated_responses": <%- JSON.stringify(generated_responses) %>
  <% } %>
  <% if (typeof parameters !== 'undefined') { %>
  , "parameters": {
    <% let comma = false; %>
    <% if (typeof parameters.min_length !== 'undefined') { %><% if (comma) { %>, <% } %>"min_length": <%= parameters.min_length %><% comma = true; %><% } %>
    <% if (typeof parameters.max_length !== 'undefined') { %><% if (comma) { %>, <% } %>"max_length": <%= parameters.max_length %><% comma = true; %><% } %>
    <% if (typeof parameters.top_k !== 'undefined') { %><% if (comma) { %>, <% } %>"top_k": <%= parameters.top_k %><% comma = true; %><% } %>
    <% if (typeof parameters.top_p !== 'undefined') { %><% if (comma) { %>, <% } %>"top_p": <%= parameters.top_p %><% comma = true; %><% } %>
    <% if (typeof parameters.temperature !== 'undefined') { %><% if (comma) { %>, <% } %>"temperature": <%= parameters.temperature %><% comma = true; %><% } %>
    <% if (typeof parameters.repetition_penalty !== 'undefined') { %><% if (comma) { %>, <% } %>"repetition_penalty": <%= parameters.repetition_penalty %><% } %>
    <% if (typeof parameters.max_time !== 'undefined') { %><% if (comma) { %>, <% } %>"max_time": <%= parameters.max_time %><% comma = true; %><% } %>
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
 * @category Huggingface Conversational Task
 * @category Requests
 */
export interface HfConversationalTaskOptions extends ModelRequestOptions {
  past_user_inputs?: string[];
  generated_responses?: string[];
  parameters?: {
    top_k?: number;
    top_p?: number;
    min_length?: number;
    max_length?: number;
    temperature?: number;
    repetition_penalty?: number;
    max_time?: number;
  };
  options?: {
    use_cache?: boolean;
    wait_for_model?: boolean;
  };
}

/**
 * @category Huggingface Conversational Task
 * @category Templates
 */
export const HfConversationalTaskTemplate =
  new EjsTemplate<HfConversationalTaskOptions>(templateSource);

const HfConversationalTaskResponseCodec = t.array(
  t.type({
    generated_text: t.string,
  }),
);

/**
 * @category Huggingface Conversational Task
 * @category Responses
 */
export interface HfConversationalTaskResponse
  extends TypeOf<typeof HfConversationalTaskResponseCodec> {}

export function isHfConversationalTaskResponse(
  response: unknown,
): response is HfConversationalTaskResponse {
  return !isLeft(HfConversationalTaskResponseCodec.decode(response));
}

/**
 *
 * ## Reference
 * [Huggingface Conversational Task](https://huggingface.co/docs/api-inference/detailed_parameters?code=curl#conversational-task)
 *
 * ## Providers using this API
 * - {@link createHuggingfaceInferenceModelProvider | Huggingface Inference API}
 *
 * @category Huggingface Conversational Task
 * @category APIs
 */
export const HfConversationalTaskApi: ModelApi<
  HfConversationalTaskOptions,
  HfConversationalTaskResponse
> = {
  requestTemplate: HfConversationalTaskTemplate,
  responseGuard: isHfConversationalTaskResponse,
};
