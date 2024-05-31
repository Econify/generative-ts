import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

import { nullable } from "../_utils/io-ts-nullable";

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
  <% if (typeof stop !== 'undefined') { %>, "stop": <%- JSON.stringify(stop) %><% } %>
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
  function_call?: string; // "none" | "auto"
  functions?: {
    name: string;
    description?: string;
    parameters?: object; // TODO: JsonSchema
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

const ChatCompletionResponseMessage = t.intersection([
  t.type({
    role: t.string,
    content: t.string, // TODO nullable(t.string) ??
  }),
  t.partial({
    tool_calls: t.array(
      t.type({
        id: t.string,
        type: t.string, // will always be "function"
        function: t.type({
          name: t.string,
          arguments: t.string,
        }),
      }),
    ),
    function_call: t.type({
      name: t.string,
      arguments: t.string,
    }),
  }),
]);

const OpenAiChatResponseCodec = t.intersection([
  t.type({
    id: t.string,
    model: t.string,
    object: t.string,
    created: t.number,
    choices: t.array(
      t.type({
        finish_reason: t.string,
        index: t.number,
        message: ChatCompletionResponseMessage,
        logprobs: nullable(
          t.type({
            content: nullable(
              t.array(
                t.type({
                  token: t.string,
                  logprob: t.number,
                  bytes: nullable(t.array(t.number)),
                  top_logprobs: t.array(
                    t.type({
                      token: t.string,
                      logprob: t.number,
                      bytes: nullable(t.array(t.number)),
                    }),
                  ),
                }),
              ),
            ),
          }),
        ),
      }),
    ),
  }),
  t.partial({
    system_fingerprint: t.string,
    usage: t.type({
      completion_tokens: t.number,
      prompt_tokens: t.number,
      total_tokens: t.number,
    }),
  }),
]);

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
