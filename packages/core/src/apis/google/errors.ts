export const FUNCTION_CALL_WITHOUT_TOOLS =
  "The last item of conversation history (`contents`) contains a `function_call`, but no `$tools` were passed, so generative-ts cannot append `function_response` to conversation history. Instead, appending prompt to end of conversation history. Model behavior might be unexpected, because model's function calls were effectively ignored.";

export const UNRESOLVED_INVOCATION =
  "The last item of conversation history (`contents`) contains a `function_call`, and a $tool with matching invocations was found, but that invocation is NOT resolved, and thus does not have a `returned` value (Did invoking the tool fail?), so generative-ts cannot append `function_response` to conversation history. Model behavior might be unexpected, because model's function calls were effectively ignored.";

export const NO_MATCHING_INVOCATION =
  "The last item of conversation history (`contents`) contains a `function_call`, and a matching `$tool` was found, but no matching invocation was found in the tool's invocations (Did you forget to invoke the tool?), so generative-ts cannot append `function_response` to conversation history. Model behavior might be unexpected, because model's function calls were effectively ignored.";

export const NO_MATCHING_TOOL =
  "The last item of conversation history (`contents`) contains a `function_call`, but no matching tool was found in `$tools`, so generative-ts cannot append `function_response` to conversation history. Model behavior might be unexpected, because model's function calls were effectively ignored.";

export class ModelInvokedNonexistentToolError extends Error {
  constructor(toolName: string) {
    super(`Model attempted to invoke tool ${toolName} that does not exist`);
    this.name = "ModelInvokedNonexistentToolError";
  }
}

export class ModelInvokedToolWithWrongArgumentsError extends Error {
  constructor(toolName: string, argName: string) {
    super(
      `Model attempted to invoke tool ${toolName} without providing required argument ${argName}`,
    );
    this.name = "ModelInvokedToolWithWrongArgumentsError";
  }
}

export class ModelInvokedToolWithUnexpectedArgumentError extends Error {
  constructor(toolName: string, argName: string) {
    super(
      `Model attempted to invoke tool ${toolName} using unexpected argument ${argName}`,
    );
    this.name = "ModelInvokedToolWithUnexpectedArgumentError";
  }
}

export class ModelInvokedToolWithInvalidArgumentTypeError extends Error {
  constructor(
    toolName: string,
    argName: string,
    expectedType: string,
    actualType: string,
  ) {
    super(
      `Model attempted to call function ${toolName} with invalid argument type for ${argName}. Should have been ${expectedType} but got ${actualType}`,
    );
    this.name = "ModelInvokedToolWithInvalidArgumentTypeError";
  }
}
