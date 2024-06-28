/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */

import type { ToolUseRequestOptions } from "../shared";

import {
  PartWithFunctionCall,
  PartWithFunctionResponse,
} from "./GoogleGeminiRequest";

import {
  NO_MATCHING_INVOCATION,
  NO_MATCHING_TOOL,
  UNRESOLVED_INVOCATION,
} from "./errors";

export function mapToolInvocationsToGeminiRequest(
  functionCalls: PartWithFunctionCall[],
  { $tools }: Required<ToolUseRequestOptions>,
): PartWithFunctionResponse[] {
  const responses: PartWithFunctionResponse[] = [];

  functionCalls.forEach(({ functionCall: { name, args } }) => {
    const matchingTool = $tools.find((tool) => tool.name === name);

    if (!matchingTool) {
      console.warn(NO_MATCHING_TOOL);
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
      console.warn(NO_MATCHING_INVOCATION);
      return;
    }

    if (!matchingInvocation.resolved) {
      console.warn(UNRESOLVED_INVOCATION);
      return;
    }

    responses.push({
      function_response: {
        name: matchingTool.name,
        response: {
          returned: matchingInvocation.returned,
        },
      },
    });
  });

  return responses;
}
