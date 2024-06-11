import { array, number, string, type } from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

import { composite, nullable } from "../_utils/ioTsHelpers";

import type { FewShotRequestOptions } from "../shared/fewShot";

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
      <% if (typeof message.name !== 'undefined') { %>, "name": "<%= message.name %>"<% } %>
      <% if (typeof message.tool_call_id !== 'undefined') { %>, "tool_call_id": "<%= message.tool_call_id %>"<% } %>
      <% if (typeof message.tool_calls !== 'undefined') { %>, "tool_calls": <%- JSON.stringify(message.tool_calls) %><% } %>
      <% if (typeof message.function_call !== 'undefined') { %>, "function_call": <%- JSON.stringify(message.function_call) %><% } %>
    },
    <% }) %>
    {
      "role": "user",
      "content": "<%= prompt %>"
    }
  ]
  <% if (typeof frequency_penalty !== 'undefined') { %>, "frequency_penalty": <%= frequency_penalty %><% } %>
  <% if (typeof logit_bias !== 'undefined') { %>, "logit_bias": <%- JSON.stringify(logit_bias) %><% } %>
  <% if (typeof logprobs !== 'undefined') { %>, "logprobs": <%= logprobs %><% } %>
  <% if (typeof top_logprobs !== 'undefined') { %>, "top_logprobs": <%= top_logprobs %><% } %>
  <% if (typeof max_tokens !== 'undefined') { %>, "max_tokens": <%= max_tokens %><% } %>
  <% if (typeof n !== 'undefined') { %>, "n": <%= n %><% } %>
  <% if (typeof presence_penalty !== 'undefined') { %>, "presence_penalty": <%= presence_penalty %><% } %>
  <% if (typeof response_format !== 'undefined') { %>, "response_format": <%- JSON.stringify(response_format) %><% } %>
  <% if (typeof seed !== 'undefined') { %>, "seed": <%= seed %><% } %>
  <% if (typeof stop !== 'undefined' && (typeof stop === 'string' || Array.isArray(stop))) { %>, "stop": "<%= stop %>"<% } %>
  <% if (typeof stream !== 'undefined') { %>, "stream": <%= stream %><% } %>
  <% if (typeof stream_options !== 'undefined') { %>, "stream_options": <%- JSON.stringify(stream_options) %><% } %>
  <% if (typeof temperature !== 'undefined') { %>, "temperature": <%= temperature %><% } %>
  <% if (typeof top_p !== 'undefined') { %>, "top_p": <%= top_p %><% } %>
  <% if (typeof user !== 'undefined') { %>, "user": "<%= user %>"<% } %>
  <% if (typeof tools !== 'undefined') { %>, "tools": <%- JSON.stringify(tools) %><% } %>
  <% if (typeof tool_choice !== 'undefined') { %>, "tool_choice": <%- JSON.stringify(tool_choice) %><% } %>
  <% if (typeof function_call !== 'undefined') { %>, "function_call": <%= function_call %><% } %>
  <% if (typeof functions !== 'undefined') { %>, "functions": <%- JSON.stringify(functions) %><% } %>
}`;

interface ChatCompletionRequestMessage {
  role: "user" | "assistant" | "system" | "tool" | "function";
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: {
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }[];
  function_call?: {
    arguments: string;
    name: string;
  };
}

/**
 * @category OpenAI ChatCompletion
 * @category Requests
 */
export interface OpenAiChatOptions
  extends ModelRequestOptions,
    FewShotRequestOptions {
  messages?: ChatCompletionRequestMessage[];
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  logprobs?: boolean;
  top_logprobs?: number;
  max_tokens?: number;
  n?: number;
  presence_penalty?: number;
  response_format?: {
    type: "text" | "json_object";
  };
  seed?: number;
  stop?: string | string[];
  stream?: boolean;
  stream_options?: {
    include_usage: boolean;
  };
  temperature?: number;
  top_p?: number;
  user?: string;
  tools?: {
    type: "function";
    function: {
      name: string;
      description?: string;
      parameters?: object; // TODO JsonSchema
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
  function_call?: string; // "none" | "auto"
  functions?: {
    name: string;
    description?: string;
    parameters?: object; // TODO JsonSchema
  }[];

  // LMStudio apparently has these additional options:
  // top_k
  // repeat_penalty
}

/**
 * @category OpenAI ChatCompletion
 * @category Templates
 */
export const OpenAiChatTemplate = new EjsTemplate<OpenAiChatOptions>(
  templateSource,
);

const OpenAiChatResponseCodec = composite({
  required: {
    id: string,
    model: string,
    object: string,
    created: number,
    choices: array(
      type({
        finish_reason: string,
        index: number,
        message: composite({
          required: {
            role: string,
            content: string, // TODO nullable(string) ??
          },
          partial: {
            tool_calls: array(
              type({
                id: string,
                type: string,
                function: type({
                  name: string,
                  arguments: string,
                }),
              }),
            ),
            function_call: type({
              name: string,
              arguments: string,
            }),
          },
        }),
        logprobs: nullable(
          type({
            content: nullable(
              array(
                type({
                  token: string,
                  logprob: number,
                  bytes: nullable(array(number)),
                  top_logprobs: array(
                    type({
                      token: string,
                      logprob: number,
                      bytes: nullable(array(number)),
                    }),
                  ),
                }),
              ),
            ),
          }),
        ),
      }),
    ),
  },
  partial: {
    system_fingerprint: string,
    usage: type({
      completion_tokens: number,
      prompt_tokens: number,
      total_tokens: number,
    }),
  },
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
 *
 * ## Reference
 * [OpenAI Chat Completion](https://github.com/openai/openai-openapi/)
 *
 * ## Providers using this API
 * - {@link createOpenAiChatModelProvider | OpenAI}
 * - {@link createGroqModelProvider | Groq}
 * - {@link createLmStudioModelProvider | LMStudio}
 *
 * @category APIs
 * @category OpenAI ChatCompletion
 * @category Provider: OpenAI
 * @category Provider: Groq
 * @category Provider: LMStudio
 *
 */
export const OpenAiChatApi: ModelApi<OpenAiChatOptions, OpenAiChatResponse> = {
  requestTemplate: OpenAiChatTemplate,
  responseGuard: isOpenAiChatResponse,
};
