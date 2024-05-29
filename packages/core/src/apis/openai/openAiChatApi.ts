import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "../../typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

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
  <% if (typeof max_tokens !== 'undefined') { %>, "max_tokens": <%= max_tokens %><% } %>
  <% if (typeof frequency_penalty !== 'undefined') { %>, "frequency_penalty": <%= frequency_penalty %><% } %>
  <% if (typeof logit_bias !== 'undefined') { %>, "logit_bias": <%- JSON.stringify(logit_bias) %><% } %>
  <% if (typeof logprobs !== 'undefined') { %>, "logprobs": <%= logprobs %><% } %>
  <% if (typeof top_logprobs !== 'undefined') { %>, "top_logprobs": <%= top_logprobs %><% } %>
  <% if (typeof n !== 'undefined') { %>, "n": <%= n %><% } %>
  <% if (typeof presence_penalty !== 'undefined') { %>, "presence_penalty": <%= presence_penalty %><% } %>
  <% if (typeof response_format !== 'undefined') { %>, "response_format": <%- JSON.stringify(response_format) %><% } %>
  <% if (typeof seed !== 'undefined') { %>, "seed": <%= seed %><% } %>
  <% if (typeof stop !== 'undefined') { %>, "stop": <%- JSON.stringify(stop) %><% } %>
  <% if (typeof top_p !== 'undefined') { %>, "top_p": <%= top_p %><% } %>
  <% if (typeof tools !== 'undefined') { %>, "tools": <%- JSON.stringify(tools) %><% } %>
  <% if (typeof tool_choice !== 'undefined') { %>, "tool_choice": <%- JSON.stringify(tool_choice) %><% } %>
  <% if (typeof user !== 'undefined') { %>, "user": "<%= user %>"<% } %>
}`;

/**
 * @category OpenAI ChatCompletion
 * @category Requests
 */
export interface OpenAiChatOptions
  extends ModelRequestOptions,
    FewShotRequestOptions {
  messages?: {
    role: "user" | "assistant" | "system";
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  logprobs?: boolean;
  top_logprobs?: number;
  n?: number;
  presence_penalty?: number;
  response_format?: {
    type: "text" | "json_object";
  };
  seed?: number;
  stop?: string | string[];
  // stream
  // stream_options
  top_p?: number;
  tools?: {
    type: "function";
    function: {
      name: string;
      description?: string;
      parameters?: object; // TODO: JsonSchema
    };
  }[];
  tool_choice?:
    | "none"
    | "auto"
    | "required"
    | {
        type: "function";
        function: {
          name: string;
        };
      };
  user?: string;
  // function_call
  // functions
}

/**
 * @category OpenAI ChatCompletion
 * @category Templates
 */
export const OpenAiChatTemplate = new EjsTemplate<OpenAiChatOptions>(
  templateSource,
);

const OpenAiChatResponseCodec = t.type({
  id: t.string,
  object: t.string,
  created: t.number,
  model: t.string,
  choices: t.array(
    t.type({
      index: t.number,
      finish_reason: t.string,
      message: t.type({
        role: t.string,
        content: t.string,
        // tool_calls
        // function_call
      }),
      // logprobs: t.type({
      //   content: t.array(
      //     t.type({
      //       token: t.string,
      //       logprob: t.number,
      //       // bytes
      //       // top_logprobs
      //     }),
      //   ),
      // }),
    }),
  ),
  usage: t.type({
    prompt_tokens: t.number,
    completion_tokens: t.number,
    total_tokens: t.number,
  }),
  // system_fingerprint: t.string,
});

/**
 * @category OpenAI ChatCompletion
 * @category Responses
 */
export interface OpenAiChatResponse
  extends TypeOf<typeof OpenAiChatResponseCodec> {}

export function isOpenAiChatResponse(
  response: unknown,
): response is OpenAiChatResponse {
  return !isLeft(OpenAiChatResponseCodec.decode(response));
}

/**
 * OpenAI Chat Completion API (https://github.com/openai/openai-openapi/)
 * Used by OpenAI, LLamaCPP frontends, Groq, and probably others
 *
 * @category OpenAI ChatCompletion
 * @category APIs
 * @type {ModelApi<OpenAiChatOptions, OpenAiChatResponse>}
 */
export const OpenAiChatApi: ModelApi<OpenAiChatOptions, OpenAiChatResponse> = {
  requestTemplate: OpenAiChatTemplate,
  responseGuard: isOpenAiChatResponse,
};
