import { array, boolean, number, record, string, type, unknown } from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

import { composite } from "../_utils/ioTsHelpers";

import type { FewShotRequestOptions } from "../shared/fewShot";

const templateSource = `{
  "model": "<%= modelId %>",
  "message": "<%= prompt %>"
  <% if (typeof chat_history !== 'undefined' || typeof examplePairs !== 'undefined') { %> 
  , "chat_history": [
    <% (typeof examplePairs !== 'undefined' ? examplePairs : []).forEach((pair, index) => { %>
    {
      "role": "USER",
      "message": "<%= pair.user %>"
    },
    {
      "role": "CHATBOT",
      "message": "<%= pair.assistant %>"
    }<% if (index < chat_history.length - 1 || typeof chat_history !== 'undefined') { %>,<% } %>
    <% }) %>
    <% (typeof chat_history !== 'undefined' ? chat_history : []).forEach((item, index) => { %>
    {
      "role": "<%= item.role %>"
      <% if (typeof item.message !== 'undefined') { %>, "message": "<%= item.message %>"<% } %>
      <% if (typeof item.tool_calls !== 'undefined') { %>, "tool_calls": <%- JSON.stringify(item.tool_calls) %><% } %>
      <% if (typeof item.tool_results !== 'undefined') { %>, "tool_results": <%- JSON.stringify(item.tool_results) %><% } %>
    }<% if (index < chat_history.length - 1) { %>,<% } %>
    <% }) %>
  ]
  <% } %>
  <% if (typeof system !== 'undefined' || typeof preamble !== 'undefined') { %>, "preamble": "<%=(typeof system !== 'undefined' ? system : "") + (typeof preamble !== 'undefined' ? preamble : "")%>"<% } %>
  <% if (typeof stream !== 'undefined') { %>, "stream": <%= stream %><% } %>
  <% if (typeof conversation_id !== 'undefined') { %>, "conversation_id": "<%= conversation_id %>"<% } %>
  <% if (typeof prompt_truncation !== 'undefined') { %>, "prompt_truncation": "<%= prompt_truncation %>"<% } %>
  <% if (typeof search_queries_only !== 'undefined') { %>, "search_queries_only": <%= search_queries_only %><% } %>
  <% if (typeof documents !== 'undefined') { %>, "documents": <%- JSON.stringify(documents) %><% } %>
  <% if (typeof citation_quality !== 'undefined') { %>, "citation_quality": "<%= citation_quality %>"<% } %>
  <% if (typeof temperature !== 'undefined') { %>, "temperature": <%= temperature %><% } %>
  <% if (typeof max_tokens !== 'undefined') { %>, "max_tokens": <%= max_tokens %><% } %>
  <% if (typeof max_input_tokens !== 'undefined') { %>, "max_input_tokens": <%= max_input_tokens %><% } %>
  <% if (typeof k !== 'undefined') { %>, "k": <%= k %><% } %>
  <% if (typeof p !== 'undefined') { %>, "p": <%= p %><% } %>
  <% if (typeof seed !== 'undefined') { %>, "seed": <%= seed %><% } %>
  <% if (typeof stop_sequences !== 'undefined') { %>, "stop_sequences": <%- JSON.stringify(stop_sequences) %><% } %>
  <% if (typeof frequency_penalty !== 'undefined') { %>, "frequency_penalty": <%= frequency_penalty %><% } %>
  <% if (typeof presence_penalty !== 'undefined') { %>, "presence_penalty": <%= presence_penalty %><% } %>
  <% if (typeof tools !== 'undefined') { %>, "tools": <%- JSON.stringify(tools) %><% } %>
  <% if (typeof tool_results !== 'undefined') { %>, "tool_results": <%- JSON.stringify(tool_results) %><% } %>
  <% if (typeof force_single_step !== 'undefined') { %>, "force_single_step": <%= force_single_step %><% } %>
}`;

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
export const CohereChatTemplate = new EjsTemplate<CohereChatOptions>(
  templateSource,
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
