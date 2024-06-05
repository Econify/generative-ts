import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/Either";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { EjsTemplate } from "../../utils/ejsTemplate";

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
        description?: string;
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

const CohereChatResponseCodec = t.type({
  text: t.string,
  generation_id: t.string,
  // citations: t.array(
  //   t.type({
  //     start: t.number,
  //     end: t.number,
  //     text: t.string,
  //     document_ids: t.array(t.string),
  //   }),
  // ),
  // documents: t.array(
  //   t.type({
  //     id: t.string,
  //     additionalProp: t.string,
  //   }),
  // ),
  // is_search_required: t.boolean,
  // search_queries: t.array(
  //   t.type({
  //     text: t.string,
  //     generation_id: t.string,
  //   }),
  // ),
  // search_results: t.array(
  //   t.type({
  //     search_query: t.type({
  //       text: t.string,
  //       generation_id: t.string,
  //     }),
  //     connector: t.type({
  //       id: t.string,
  //     }),
  //     document_ids: t.array(t.string),
  //     error_message: t.string,
  //     continue_on_failure: t.boolean,
  //   }),
  // ),
  // finish_reason: t.string,
  // tool_calls: t.array(
  //   t.type({
  //     name: t.string,
  //     parameters: t.record(t.string, t.unknown),
  //   }),
  // ),
  // chat_history: t.array(
  //   t.union([
  //     t.type({
  //       role: t.string,
  //       message: t.string,
  //       tool_calls: t.array(
  //         t.type({
  //           name: t.string,
  //           parameters: t.record(t.string, t.unknown),
  //         }),
  //       ),
  //     }),
  //     t.type({
  //       role: t.string,
  //       tool_results: t.array(
  //         t.type({
  //           call: t.type({
  //             name: t.string,
  //             parameters: t.record(t.string, t.unknown),
  //           }),
  //           outputs: t.array(t.record(t.string, t.unknown)),
  //         }),
  //       ),
  //     }),
  //   ]),
  // ),
  // meta: t.type({
  //   api_version: t.type({
  //     version: t.string,
  //     is_deprecated: t.boolean,
  //     is_experimental: t.boolean,
  //   }),
  //   billed_units: t.type({
  //     input_tokens: t.number,
  //     output_tokens: t.number,
  //     search_units: t.number,
  //     classifications: t.number,
  //   }),
  //   tokens: t.type({
  //     input_tokens: t.number,
  //     output_tokens: t.number,
  //   }),
  //   warnings: t.array(t.string),
  // }),
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
