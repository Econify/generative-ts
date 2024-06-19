import { ConvertParamMapToArgs, Tool, ToolParamMap } from "../../utils/Tool";

import type { GoogleGeminiResponse } from "./gemini";

/**
 * @category Google Gemini
 * @category Tools
 */
export function mapGeminiResponseToToolInvocations<
  TParamMap extends ToolParamMap,
>(
  { data: { candidates } }: GoogleGeminiResponse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools: Tool<TParamMap>[],
) {
  if (!tools.length) {
    return;
  }

  candidates.forEach((candidate) => {
    candidate.content?.parts.forEach((part) => {
      if (part.functionCall) {
        const { name, args } = part.functionCall;

        const tool = tools.find(({ descriptor }) => descriptor.name === name);

        if (!tool) {
          throw new Error(
            `Model attempted to invoke tool ${name} that does not exist`,
          );
        }

        // TODO: check unexpected arguments
        // Object.keys(args).forEach((argName) => {
        //   if (!$tool.parameters?.some((param) => param.name === argName)) {
        //     throw new Error(
        //       `Model attempted to invoke tool ${name} using unexpected argument ${argName}`,
        //     );
        //   }
        // });

        const validatedArgs: Record<string, string | number | boolean> = {};

        tool.descriptor.parameters.forEach((param) => {
          const argValue = args[param.name];

          if (!argValue && param.required) {
            throw new Error(
              `Model attempted to call function ${name} without providing required argument ${param.name}`,
            );
          }

          if (!argValue) {
            return;
          }

          switch (param.type) {
            case "STR":
              if (typeof argValue !== "string") {
                throw new Error(
                  `Model attempted to call function ${name} with invalid argument type for ${param.name}. Should have been ${param.type} but got ${typeof argValue}`,
                );
              }
              break;
            case "NUM":
              if (typeof argValue !== "number") {
                throw new Error(
                  `Model attempted to call function ${name} with invalid argument type for ${param.name}. Should have been ${param.type} but got ${typeof argValue}`,
                );
              }
              break;
            case "BOOL":
              if (typeof argValue !== "boolean") {
                throw new Error(
                  `Model attempted to call function ${name} with invalid argument type for ${param.name}. Should have been ${param.type} but got ${typeof argValue}`,
                );
              }
              break;
            default:
              // impossible
              return;
          }

          validatedArgs[param.name] = argValue;
        });

        tool.invoke(validatedArgs as ConvertParamMapToArgs<TParamMap>);
      }
    });
  });
}
