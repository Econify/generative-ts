/* eslint-disable camelcase */
import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { FnTemplate } from "../../utils/Template";

import { composite } from "../_utils/ioTsHelpers";

import type { FewShotRequestOptions } from "../shared";

interface Content {
  role?: "user" | "model";
  parts: {
    text?: string;
    function_call?: {
      name: string;
      args: Record<string, string>;
    };
    function_response?: {
      name: string;
      response: Record<string, string>;
    };
    // inline_data (not supported)
    // file_data (not supported)
    // video_metadata (not supported)
  }[];
}

interface Schema {
  type: "STRING" | "INTEGER" | "BOOLEAN" | "NUMBER" | "ARRAY" | "OBJECT";
  description?: string;
  enum?: string[];
  items?: Schema[];
  properties?: {
    [key: string]: Schema;
  };
  required?: string[];
  nullable?: boolean;
}

/**
 * @category Google Gemini
 * @category Requests
 */
export interface GoogleGeminiOptions
  extends FewShotRequestOptions,
    ModelRequestOptions {
  contents?: Content | Content[];
  system_instruction?: Content;
  tools?: {
    function_declarations: {
      name: string;
      description?: string;
      parameters?: Schema;
      response?: Schema;
    }[];
  }[];
  tools_config?: {
    mode?: "AUTO" | "NONE" | "ANY";
    allowed_function_names?: string[];
  };
  safety_settings?: {
    category?: string;
    threshold?: string;
    max_influential_terms?: number;
    method?: string;
  };
  generation_config?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    candidate_count?: number;
    max_output_tokens?: number;
    stop_sequences?: string[];
    presence_penalty?: number;
    frequency_penalty?: number;
    response_mime_type?: "text/plain" | "application/json";
  };
}

/**
 * @category Google Gemini
 * @category Templates
 */
export const GoogleGeminiTemplate = new FnTemplate(
  ({
    prompt,
    examplePairs,
    contents,
    system,
    tools,
    tools_config,
    system_instruction,
    safety_settings,
    generation_config,
  }: GoogleGeminiOptions) => {
    const rewritten = {
      contents: [
        ...(examplePairs
          ? examplePairs.flatMap((pair) => [
              {
                role: "user",
                parts: [{ text: pair.user }],
              },
              {
                role: "model",
                parts: [{ text: pair.assistant }],
              },
            ])
          : []),
        ...(contents
          ? (Array.isArray(contents) ? contents : [contents]).map(
              (contentItem) => ({
                parts: contentItem.parts.map((part) => ({
                  ...(part.text ? { text: part.text } : {}),
                  ...(part.function_call
                    ? {
                        function_call: {
                          name: part.function_call.name,
                          args: part.function_call.args,
                        },
                      }
                    : {}),
                  ...(part.function_response
                    ? {
                        function_response: {
                          name: part.function_response.name,
                          response: part.function_response.response,
                        },
                      }
                    : {}),
                })),
                ...(contentItem.role ? { role: contentItem.role } : {}),
              }),
            )
          : []),
        // Only insert a user prompt if the last item in contents is NOT user
        // TODO: revisit this logic. it's basically a hack caused by the facts (1) tool results in gemini are specified via user messages (2) our interface requires 'prompt' (3) gemini errors if two user messages are consecutive so, in the case tool results are given, our interface still requires 'prompt' but CANNOT insert it
        ...(!contents ||
        (Array.isArray(contents) &&
          (!contents.length || contents[contents.length - 1]?.role !== "user"))
          ? [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ]
          : []),
      ],
      ...(tools
        ? {
            tools: tools.map((tool) => ({
              function_declarations: tool.function_declarations.map(
                (declaration) => ({
                  name: declaration.name,
                  ...(declaration.description
                    ? { description: declaration.description }
                    : {}),
                  ...(declaration.parameters
                    ? { parameters: declaration.parameters }
                    : {}),
                  ...(declaration.response
                    ? { response: declaration.response }
                    : {}),
                }),
              ),
            })),
          }
        : {}),
      ...(tools_config
        ? {
            tools_config: {
              ...(tools_config.mode ? { mode: tools_config.mode } : {}),
              ...(tools_config.allowed_function_names
                ? {
                    allowed_function_names: tools_config.allowed_function_names,
                  }
                : {}),
            },
          }
        : {}),
      ...(system_instruction || system
        ? {
            system_instruction: {
              parts: [
                ...(system ? [{ text: system }] : []),
                ...(system_instruction
                  ? system_instruction.parts.map((part) => ({
                      ...(part.text ? { text: part.text } : {}),
                    }))
                  : []),
              ],
            },
          }
        : {}),
      ...(safety_settings
        ? {
            safety_settings: {
              ...(safety_settings.category
                ? { category: safety_settings.category }
                : {}),
              ...(safety_settings.threshold
                ? { threshold: safety_settings.threshold }
                : {}),
              ...(safety_settings.max_influential_terms
                ? {
                    max_influential_terms:
                      safety_settings.max_influential_terms,
                  }
                : {}),
              ...(safety_settings.method
                ? { method: safety_settings.method }
                : {}),
            },
          }
        : {}),
      ...(generation_config
        ? {
            generation_config: {
              ...(generation_config.temperature
                ? { temperature: generation_config.temperature }
                : {}),
              ...(generation_config.top_p
                ? { top_p: generation_config.top_p }
                : {}),
              ...(generation_config.top_k
                ? { top_k: generation_config.top_k }
                : {}),
              ...(generation_config.candidate_count
                ? { candidate_count: generation_config.candidate_count }
                : {}),
              ...(generation_config.max_output_tokens
                ? { max_output_tokens: generation_config.max_output_tokens }
                : {}),
              ...(generation_config.stop_sequences
                ? { stop_sequences: generation_config.stop_sequences }
                : {}),
              ...(generation_config.presence_penalty
                ? { presence_penalty: generation_config.presence_penalty }
                : {}),
              ...(generation_config.frequency_penalty
                ? { frequency_penalty: generation_config.frequency_penalty }
                : {}),
              ...(generation_config.response_mime_type
                ? { response_mime_type: generation_config.response_mime_type }
                : {}),
            },
          }
        : {}),
    };

    return JSON.stringify(rewritten, null, 2);
  },
);

const GoogleGeminiResponseCodec = t.type({
  data: t.type({
    candidates: t.array(
      composite({
        required: {
          finishReason: t.string,
        },
        partial: {
          content: t.type({
            role: t.string,
            parts: t.array(
              t.partial({
                text: t.string,
                functionCall: t.type({
                  name: t.string,
                  args: t.record(t.string, t.string),
                }),
              }),
            ),
          }),
          citationMetadata: t.type({
            citations: t.array(
              t.partial({
                uri: t.string,
                startIndex: t.number,
                endIndex: t.number,
              }),
            ),
          }),
          safetyRatings: t.array(
            t.type({
              category: t.string,
              probability: t.string,
              probabilityScore: t.number,
              severity: t.string,
              severityScore: t.number,
            }),
          ),
        },
      }),
    ),
    usageMetadata: t.type({
      candidatesTokenCount: t.number,
      promptTokenCount: t.number,
      totalTokenCount: t.number,
    }),
  }),
  headers: t.record(t.string, t.unknown),
  status: t.number,
  statusText: t.string,
  // config
  // request
});

/**
 * @category Google Gemini
 * @category Responses
 */
export interface GoogleGeminiResponse
  extends TypeOf<typeof GoogleGeminiResponseCodec> {}

export function isGoogleGeminiResponse(
  response: unknown,
): response is GoogleGeminiResponse {
  return !isLeft(GoogleGeminiResponseCodec.decode(response));
}

export interface GoogleGeminiApi
  extends ModelApi<GoogleGeminiOptions, GoogleGeminiResponse> {}

/**
 *
 * ## Reference
 * - {@link https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference | Gemini Inference API}
 * - {@link https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/function-calling | Gemini Function Calling API}
 *
 * ## Providers using this API
 * - {@link createVertexAiModelProvider | GCloud VertexAI}
 *
 * @category APIs
 * @category Google Gemini
 * @category Provider: GCloud VertexAI
 *
 */
export const GoogleGeminiApi: GoogleGeminiApi = {
  requestTemplate: GoogleGeminiTemplate,
  responseGuard: isGoogleGeminiResponse,
};
