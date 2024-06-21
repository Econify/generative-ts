/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */

import type { ModelApi } from "@typeDefs";

import { FnTemplate } from "../../utils/Template";

import { mapToolDescriptionsToGeminiRequest } from "./mapToolDescriptionsToGeminiRequest";
import { mapToolResultsToGeminiRequest } from "./mapToolResultsToGeminiRequest";
import {
  GoogleGeminiResponse,
  isGoogleGeminiResponse,
} from "./GoogleGeminiResponse";
import {
  GoogleGeminiOptions,
  PartWithFunctionCall,
} from "./GoogleGeminiRequest";

import { FUNCTION_CALL_WITHOUT_TOOLS } from "./errors";

/**
 * @category Google Gemini
 * @category Templates
 */
export const GoogleGeminiTemplate = new FnTemplate(
  ({
    $prompt,
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
    let _contents = (
      contents && Array.isArray(contents) ? contents : [contents]
    ).filter((i) => i);

    const firstItem = _contents[0];
    const lastItem = _contents[_contents.length - 1];

    // the conversation must start with a user message:
    if (!firstItem || firstItem.role === "model") {
      _contents = [
        {
          role: "user",
          parts: [{ text: $prompt }],
        },
        ..._contents,
      ];
    }

    // the conversation must end with a user message (either $prompt or tool responses):
    if (lastItem && lastItem.role === "model") {
      const functionCalls = lastItem.parts.filter(
        (part): part is PartWithFunctionCall => "functionCall" in part,
      );

      if (functionCalls.length && $tools) {
        const responses = mapToolResultsToGeminiRequest(functionCalls, {
          $tools,
        });

        if (responses.length) {
          _contents = [
            ..._contents,
            {
              role: "user",
              parts: responses,
            },
          ];
        } else {
          // if no tool responses, we logged a warning in `applyFunctionCalls`, and now append $prompt as fallback:
          _contents = [
            ..._contents,
            {
              role: "user",
              parts: [{ text: $prompt }],
            },
          ];
        }
      } else {
        if (functionCalls.length && !$tools) {
          console.warn(FUNCTION_CALL_WITHOUT_TOOLS);
        }

        _contents = [
          ..._contents,
          {
            role: "user",
            parts: [{ text: $prompt }],
          },
        ];
      }
    }

    const rewritten = {
      contents: [
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
        ..._contents,
      ],
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
