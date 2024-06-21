/* eslint-disable camelcase */
import { array, number, string, type } from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { FnTemplate } from "../../utils/Template";

import { composite, nullable } from "../_utils/ioTsHelpers";

import type { FewShotRequestOptions } from "../shared";

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

interface OpenAiChatToolsOptions {
  tools?: {
    type: "function";
    function: {
      name: string;
      description?: string;
      parameters?: object; // TODO JsonSchema
    };
  }[];
}

/**
 * @category OpenAI ChatCompletion
 * @category Requests
 */
export interface OpenAiChatOptions
  extends ModelRequestOptions,
    FewShotRequestOptions,
    OpenAiChatToolsOptions {
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
}

/**
 * @category OpenAI ChatCompletion
 * @category Templates
 */
export const OpenAiChatTemplate = new FnTemplate(
  ({
    modelId,
    $prompt,
    system,
    examplePairs,
    messages,
    frequency_penalty,
    logit_bias,
    logprobs,
    top_logprobs,
    max_tokens,
    n,
    presence_penalty,
    response_format,
    seed,
    stop,
    stream,
    stream_options,
    temperature,
    top_p,
    user,
    tools,
    tool_choice,
    function_call,
    functions,
  }: OpenAiChatOptions) => {
    const rewritten = {
      model: modelId,
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        ...(examplePairs
          ? examplePairs.flatMap((pair) => [
              { role: "user", content: pair.user },
              { role: "assistant", content: pair.assistant },
            ])
          : []),
        ...(messages
          ? messages.map((message) => ({
              role: message.role,
              content: message.content,
              ...(message.name ? { name: message.name } : {}),
              ...(message.tool_call_id
                ? { tool_call_id: message.tool_call_id }
                : {}),
              ...(message.tool_calls ? { tool_calls: message.tool_calls } : {}),
              ...(message.function_call
                ? { function_call: message.function_call }
                : {}),
            }))
          : []),
        { role: "user", content: $prompt },
      ],
    };

    const result = {
      ...rewritten,
      frequency_penalty,
      logit_bias,
      logprobs,
      top_logprobs,
      max_tokens,
      n,
      presence_penalty,
      response_format,
      seed,
      stop,
      stream,
      stream_options,
      temperature,
      top_p,
      user,
      tools,
      tool_choice,
      function_call,
      functions,
    };

    return JSON.stringify(result, null, 2);
  },
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
