/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import * as t from "io-ts";
import type { TypeOf } from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { FnTemplate } from "../../utils/Template";

import { composite } from "../_utils/ioTsHelpers";

import type { FewShotRequestOptions, ToolUseRequestOptions } from "../shared";

interface FunctionCall {
  name: string;
  args: Record<string, unknown>;
}

interface FunctionResponse {
  name: string;
  response: Record<string, unknown>;
}

interface Part {
  text?: string;
  functionCall?: FunctionCall; // TODO deal with casing disparity
  function_response?: FunctionResponse;
}

interface PartWithFunctionCall extends Part {
  functionCall: FunctionCall;
}

interface PartWithFunctionResponse extends Part {
  function_response: FunctionResponse;
}

interface GoogleGeminiContentItem {
  role?: "user" | "model";
  parts: Part[];
}

interface GoogleGeminiSchema {
  type: "STRING" | "INTEGER" | "BOOLEAN" | "NUMBER" | "ARRAY" | "OBJECT";
  description?: string;
  enum?: string[];
  items?: GoogleGeminiSchema[];
  properties?: {
    [key: string]: GoogleGeminiSchema;
  };
  required?: string[];
  nullable?: boolean;
}

interface GoogleGeminiToolsOptions {
  tools?: {
    function_declarations: {
      name: string;
      description?: string;
      parameters?: GoogleGeminiSchema;
      response?: GoogleGeminiSchema;
    }[];
  }[];
}

/**
 * @category Google Gemini
 * @category Requests
 */
export interface GoogleGeminiOptions
  extends ModelRequestOptions,
    FewShotRequestOptions,
    ToolUseRequestOptions,
    GoogleGeminiToolsOptions {
  contents?: GoogleGeminiContentItem | GoogleGeminiContentItem[];
  system_instruction?: GoogleGeminiContentItem;
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

const toGeminiToolParamType = (type: "STR" | "NUM" | "BOOL") => {
  return (
    (type === "STR" && "STRING") || (type === "NUM" && "NUMBER") || "BOOLEAN"
  );
};

function mapToolDescriptionsToGeminiRequest({
  $tools: tools,
}: ToolUseRequestOptions): GoogleGeminiToolsOptions {
  if (!tools) {
    return {
      tools: [],
    };
  }

  return {
    tools: [
      {
        function_declarations: tools.map((tool) => {
          return {
            name: tool.name,
            description: tool.description,
            ...(tool.parameters
              ? {
                  parameters: {
                    type: "OBJECT",
                    properties: tool.parameters.reduce(
                      (acc, param) => {
                        acc[param.name] = {
                          type: toGeminiToolParamType(param.type),
                          description: param.description,
                        };
                        return acc;
                      },
                      {} as { [key: string]: GoogleGeminiSchema },
                    ),
                    required: tool.parameters
                      .filter(({ required }) => required)
                      .map(({ name }) => name),
                  },
                }
              : {}),
          };
        }),
      },
    ],
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
    system,
    $tools,
    contents,
    tools,
    tools_config,
    system_instruction,
    safety_settings,
    generation_config,
  }: GoogleGeminiOptions) => {
    const _contents: GoogleGeminiContentItem[] = [
      ...(examplePairs
        ? examplePairs.flatMap((pair) => [
            {
              role: "user" as const,
              parts: [{ text: pair.user }],
            },
            {
              role: "model" as const,
              parts: [{ text: pair.assistant }],
            },
          ])
        : []),

      ...(contents ? (Array.isArray(contents) ? contents : [contents]) : []),
    ];

    const lastItem = _contents[_contents.length - 1];

    if (!lastItem) {
      _contents.push({
        role: "user",
        parts: [{ text: prompt }],
      });
    } else if (lastItem.role === "model") {
      const functionCalls = lastItem.parts
        .filter((part): part is PartWithFunctionCall => "functionCall" in part)
        .map((part) => part.functionCall);

      if (functionCalls.length && $tools) {
        const responses: PartWithFunctionResponse[] = [];

        functionCalls.forEach(({ name, args }) => {
          const matchingTool = $tools.find((tool) => tool.name === name);

          if (!matchingTool) {
            console.warn(
              "The last item of conversation history (`contents`) contains a `function_call`, but no matching tool was found in `$tools`. Model behavior might be unexpected, because model's function calls were effectively ignored.",
            );

            return;
          }

          const matchingInvocation = matchingTool.invocations
            ?.reverse()
            .find((invocation) =>
              Object.keys(args).every(
                (key) =>
                  key in invocation.arguments &&
                  invocation.arguments[key] === args[key],
              ),
            );

          if (!matchingInvocation) {
            console.warn(
              "The last item of conversation history (`contents`) contains a `function_call`, and a matching `$tool` was found, but no matching invocation was found in the tool's invocations. (Did you forget to call `mapGeminiResponseToToolInvocations`?) Model behavior might be unexpected, because model's function calls were effectively ignored.",
            );

            return;
          }

          const { returned } = matchingInvocation;

          if (!returned) {
            console.warn(
              "The last item of conversation history (`contents`) contains a `function_call`, and a $tool with matching invocations was found, but that invocation does NOT have a `returned` value! (Did you forget to execute the tool?) Model behavior might be unexpected, because model's function calls were effectively ignored.",
            );

            return;
          }

          responses.push({
            function_response: {
              name: matchingTool.name,
              response: {
                returned,
              },
            },
          });
        });

        _contents.push({
          role: "user",
          parts: responses,
        });
      } else {
        if (functionCalls.length && !$tools) {
          console.warn(
            "The last item of conversation history (`contents`) contains a `function_call`, but no `$tools` were passed, so generative-ts cannot append `function_response` to conversation history. Instead, appending prompt to end of conversation history. Model behavior might be unexpected, because model's function calls were effectively ignored.",
          );
        }

        _contents.push({
          role: "user",
          parts: [{ text: prompt }],
        });
      }
    }

    const rewritten = {
      contents: _contents,
      ...(tools || $tools
        ? {
            tools: [
              ...(tools || []),
              ...($tools
                ? mapToolDescriptionsToGeminiRequest({ $tools }).tools || []
                : []),
            ],
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
      ...(tools_config
        ? {
            tools_config,
          }
        : {}),
      ...(safety_settings
        ? {
            safety_settings,
          }
        : {}),
      ...(generation_config
        ? {
            generation_config,
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
                  args: t.record(t.string, t.unknown),
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
