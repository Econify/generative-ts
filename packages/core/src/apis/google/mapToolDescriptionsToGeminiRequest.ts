import type { ToolUseRequestOptions } from "../shared";

import {
  GoogleGeminiSchema,
  GoogleGeminiToolsOptions,
} from "./GoogleGeminiRequest";

const toGeminiToolParamType = (type: "STR" | "NUM" | "BOOL") => {
  return (
    (type === "STR" && "STRING") || (type === "NUM" && "NUMBER") || "BOOLEAN"
  );
};

export function mapToolDescriptionsToGeminiRequest({
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
