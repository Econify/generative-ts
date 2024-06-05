import {
  array,
  boolean,
  number,
  record,
  string,
  type,
  union,
  unknown,
} from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

import { composite } from "../_utils/ioTsHelpers";

const templateSource = `{
  "model": "<%= modelId %>",
  "message": "<%= prompt %>"
  <% if (typeof stream !== 'undefined') { %>, "stream": <%= stream %><% } %>
  <% if (typeof preamble !== 'undefined') { %>, "preamble": "<%= preamble %>"<% } %>
  <% if (typeof chat_history !== 'undefined') { %>, "chat_history": <%- JSON.stringify(chat_history) %><% } %>
}`;

/**
 * @category Requests
 * @category Cohere Chat
 */
export interface CohereChatOptions extends ModelRequestOptions {
  stream?: boolean;
  preamble?: string;
  chat_history?: Array<{
    role: "SYSTEM" | "CHATBOT" | "USER" | "TOOL";
    message: string;
    tool_calls?: Array<{
      name: string;
      parameters: Record<string, string>;
    }>;
    tool_results?: Array<{
      call: {
        name: string;
        parameters: Record<string, string>;
      };
      outputs: Array<Record<string, string>>;
    }>;
  }>;
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
        description?: string; // "any python data type, such as 'str', 'bool'" - ???
        required?: boolean;
      }
    >;
  }>;
  tool_results?: Array<{
    call: {
      name: string;
      parameters: Record<string, string>;
    };
    outputs: Array<Record<string, string>>;
  }>;
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
      union([
        composite({
          required: {
            role: string, // probably "SYSTEM" | "CHATBOT" | "USER"
            message: string,
          },
          partial: {
            tool_calls: array(
              type({
                name: string,
                parameters: record(string, unknown),
              }),
            ),
          },
        }),
        type({
          role: string, // probably "TOOL" ?
          tool_results: array(
            type({
              call: type({
                name: string,
                parameters: record(string, unknown),
              }),
              outputs: array(record(string, unknown)),
            }),
          ),
        }),
      ]),
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
        tokens: type({
          input_tokens: number,
          output_tokens: number,
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
    documents: array(
      type({
        id: string,
        additionalProp: string,
      }),
    ),
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
