/* eslint-disable camelcase */
import { array, boolean, number, record, string, type, unknown } from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { FnTemplate } from "../../utils/Template";

import { composite } from "../_utils/ioTsHelpers";

import type { FewShotRequestOptions } from "../shared";

interface CohereChatToolExecutionResult {
  call: {
    name: string;
    parameters: Record<string, string>;
  };
  outputs: Array<Record<string, string>>;
}

interface CohereChatHistoryMessage {
  role: "SYSTEM" | "CHATBOT" | "USER";
  message: string;
}

interface CohereChatHistoryToolCall {
  role: "SYSTEM" | "CHATBOT" | "USER";
  tool_calls: Array<{
    name: string;
    parameters: Record<string, string>;
  }>;
  message?: string; // Cohere API docs say this is required, but I dont think it is, and don't think it's used with tools?
}

interface CohereChatHistoryToolResults {
  role: "TOOL";
  tool_results: Array<CohereChatToolExecutionResult>;
  message?: string; // Cohere API docs say this is required, but I dont think it is, and don't think it's used with tools?
}

type CohereChatHistoryItem =
  | CohereChatHistoryMessage
  | CohereChatHistoryToolCall
  | CohereChatHistoryToolResults;

function isToolCallItem(
  item: CohereChatHistoryItem,
): item is CohereChatHistoryToolCall {
  return "tool_calls" in item;
}

function isToolResultItem(
  item: CohereChatHistoryItem,
): item is CohereChatHistoryToolResults {
  return "tool_results" in item;
}

/**
 * @category Requests
 * @category Cohere Chat
 */
export interface CohereChatOptions
  extends ModelRequestOptions,
    FewShotRequestOptions {
  stream?: boolean;
  preamble?: string;
  chat_history?: Array<CohereChatHistoryItem>;
  conversation_id?: string;
  prompt_truncation?: string;
  // connectors
  search_queries_only?: boolean;
  documents?: Array<Record<string, string>>;
  citation_quality?: string;
  temperature?: number;
  max_tokens?: number;
  max_input_tokens?: number;
  k?: number;
  p?: number;
  seed?: number;
  stop_sequences?: Array<string>;
  frequency_penalty?: number;
  presence_penalty?: number;
  tools?: Array<{
    name: string;
    description: string;
    parameter_definitions?: Record<
      string,
      {
        type: string;
        description?: string; // "any python data type, such as 'str', 'bool'" - ?
        required?: boolean;
      }
    >;
  }>;
  tool_results?: Array<CohereChatToolExecutionResult>;
  force_single_step?: boolean;
}

/**
 * @category Templates
 * @category Cohere Chat
 */
export const CohereChatTemplate = new FnTemplate(
  ({
    modelId,
    prompt,
    chat_history,
    examplePairs,
    system,
    preamble,
    stream,
    conversation_id,
    prompt_truncation,
    search_queries_only,
    documents,
    citation_quality,
    temperature,
    max_tokens,
    max_input_tokens,
    k,
    p,
    seed,
    stop_sequences,
    frequency_penalty,
    presence_penalty,
    tools,
    tool_results,
    force_single_step,
  }: CohereChatOptions) => {
    const rewritten = {
      model: modelId,
      message: prompt,
      ...(chat_history || examplePairs
        ? {
            chat_history: [
              ...(examplePairs
                ? examplePairs.flatMap((pair) => [
                    { role: "USER", message: pair.user },
                    { role: "CHATBOT", message: pair.assistant },
                  ])
                : []),
              ...(chat_history
                ? chat_history.map((item) => {
                    const baseItem = {
                      role: item.role,
                      ...(item.message ? { message: item.message } : {}),
                    };
                    if (isToolCallItem(item)) {
                      return { ...baseItem, tool_calls: item.tool_calls };
                    }
                    if (isToolResultItem(item)) {
                      return { ...baseItem, tool_results: item.tool_results };
                    }
                    return baseItem;
                  })
                : []),
            ],
          }
        : {}),
      ...(system || preamble
        ? { preamble: `${system || ""}${preamble || ""}` }
        : {}),
    };

    const result = {
      ...rewritten,
      stream,
      conversation_id,
      prompt_truncation,
      search_queries_only,
      documents,
      citation_quality,
      temperature,
      max_tokens,
      max_input_tokens,
      k,
      p,
      seed,
      stop_sequences,
      frequency_penalty,
      presence_penalty,
      tools,
      tool_results,
      force_single_step,
    };

    return JSON.stringify(result, null, 2);
  },
);

const CohereChatResponseCodec = composite({
  required: {
    text: string,
    generation_id: string,
    finish_reason: string,
    chat_history: array(
      composite({
        required: {
          role: string,
        },
        partial: {
          message: string,
          tool_calls: array(
            type({
              name: string,
              parameters: record(string, unknown),
            }),
          ),
          tool_results: array(
            type({
              call: type({
                name: string,
                parameters: record(string, unknown),
              }),
              outputs: array(record(string, unknown)),
            }),
          ),
        },
      }),
    ),
    meta: composite({
      required: {
        api_version: composite({
          required: {
            version: string,
          },
          partial: {
            is_deprecated: boolean,
            is_experimental: boolean,
          },
        }),
        billed_units: composite({
          required: {
            input_tokens: number,
            output_tokens: number,
          },
          partial: {
            search_units: number,
            classifications: number,
          },
        }),
        tokens: composite({
          required: {
            output_tokens: number,
          },
          partial: {
            input_tokens: number,
          },
        }),
      },
      partial: {
        warnings: array(string),
      },
    }),
  },
  partial: {
    tool_calls: array(
      type({
        name: string,
        parameters: record(string, unknown),
      }),
    ),
    citations: array(
      type({
        start: number,
        end: number,
        text: string,
        document_ids: array(string),
      }),
    ),
    documents: array(record(string, unknown)),
    is_search_required: boolean,
    search_queries: array(
      type({
        text: string,
        generation_id: string,
      }),
    ),
    search_results: array(
      type({
        search_query: type({
          text: string,
          generation_id: string,
        }),
        connector: type({
          id: string,
        }),
        document_ids: array(string),
        error_message: string,
        continue_on_failure: boolean,
      }),
    ),
    response_id: string,
  },
});

/**
 * @category Responses
 * @category Cohere Chat
 */
export interface CohereChatResponse
  extends TypeOf<typeof CohereChatResponseCodec> {}

export function isCohereChatResponse(
  response: unknown,
): response is CohereChatResponse {
  return !isLeft(CohereChatResponseCodec.decode(response));
}

export interface CohereChatApi
  extends ModelApi<CohereChatOptions, CohereChatResponse> {}

/**
 *
 * ## Reference
 * [Cohere Chat](https://docs.cohere.com/reference/chat)
 *
 * ## Providers using this API
 * - {@link createCohereModelProvider | Cohere}
 *
 * @category APIs
 * @category Cohere Chat
 * @category Provider: Cohere
 *
 */
export const CohereChatApi: CohereChatApi = {
  requestTemplate: CohereChatTemplate,
  responseGuard: isCohereChatResponse,
  name: "COHERE-CHAT",
};
