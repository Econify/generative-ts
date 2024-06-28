import { Tool } from "../../utils/Tool";

import type { ConvertParamMapToArgs, ToolParamMap } from "../../utils/Tool";

import {
  ModelInvokedNonexistentToolError,
  ModelInvokedToolWithInvalidArgumentTypeError,
  ModelInvokedToolWithUnexpectedArgumentError,
  ModelInvokedToolWithWrongArgumentsError,
} from "./errors";

import type { GoogleGeminiResponse } from "./GoogleGeminiResponse";

// TODO this will eventually happen internally "somewhere"

export function mapGeminiResponseToToolInvocations<
  TParamMap extends ToolParamMap,
>({ data: { candidates } }: GoogleGeminiResponse, tools: Tool<TParamMap>[]) {
  if (!tools.length) {
    return;
  }

  candidates.forEach((candidate) => {
    candidate.content?.parts.forEach((part) => {
      if (part.functionCall) {
        const { name, args } = part.functionCall;

        const tool = tools.find(({ descriptor }) => descriptor.name === name);

        if (!tool) {
          throw new ModelInvokedNonexistentToolError(name);
        }

        Object.keys(args).forEach((argName) => {
          if (
            !tool.descriptor.parameters.some((param) => param.name === argName)
          ) {
            throw new ModelInvokedToolWithUnexpectedArgumentError(
              name,
              argName,
            );
          }
        });

        const validatedArgs: Record<string, string | number | boolean> = {};

        tool.descriptor.parameters.forEach((param) => {
          const argValue = args[param.name];

          if (!argValue && param.required) {
            throw new ModelInvokedToolWithWrongArgumentsError(name, param.name);
          }

          if (!argValue) {
            return;
          }
          switch (param.type) {
            case "STR":
              if (typeof argValue !== "string") {
                throw new ModelInvokedToolWithInvalidArgumentTypeError(
                  name,
                  param.name,
                  param.type,
                  typeof argValue,
                );
              }
              break;
            case "NUM":
              if (typeof argValue !== "number") {
                throw new ModelInvokedToolWithInvalidArgumentTypeError(
                  name,
                  param.name,
                  param.type,
                  typeof argValue,
                );
              }
              break;
            case "BOOL":
              if (typeof argValue !== "boolean") {
                throw new ModelInvokedToolWithInvalidArgumentTypeError(
                  name,
                  param.name,
                  param.type,
                  typeof argValue,
                );
              }
              break;
            default:
              // impossible
              return;
          }

          validatedArgs[param.name] = argValue;
        });

        tool.addInvocation(validatedArgs as ConvertParamMapToArgs<TParamMap>);
      }
    });
  });
}
