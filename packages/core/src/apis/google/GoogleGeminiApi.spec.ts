import { GoogleGeminiApi } from "./GoogleGeminiApi";
import type { GoogleGeminiOptions } from "./GoogleGeminiRequest";

function render(context: Omit<GoogleGeminiOptions, "modelId">) {
  try {
    const rendered = GoogleGeminiApi.requestTemplate.render({
      modelId: "mock-model-id",
      ...context,
    });
    return JSON.parse(rendered);
  } catch (error) {
    throw new Error("Invalid JSON output");
  }
}

describe("GoogleGeminiApi.requestTemplate", () => {
  /**
   * FewShotRequestOptions (prompt, examplePairs, system):
   */

  test("prompt", () => {
    const rendered = render({
      prompt: "mock-prompt",
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, examplePairs", () => {
    const rendered = render({
      prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
        { user: "mock-user-msg-2", assistant: "mock-assistant-msg-2" },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, system", () => {
    const rendered = render({
      prompt: "mock-prompt",
      system: "mock-system-text",
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, examplePairs, system", () => {
    const rendered = render({
      prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
      ],
      system: "mock-system-text",
    });
    expect(rendered).toMatchSnapshot();
  });

  /**
   * "Native" few shot options (prompt, contents, system_instruction):
   */

  test("prompt, contents with user / model (appends prompt)", () => {
    const rendered = render({
      prompt: "mock-prompt",
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-user-text" }],
        },
        {
          role: "model",
          parts: [{ text: "mock-model-text" }],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, contents with model / user (prepends prompt)", () => {
    const rendered = render({
      prompt: "mock-prompt",
      contents: [
        {
          role: "model",
          parts: [{ text: "mock-model-text" }],
        },
        {
          role: "user",
          parts: [{ text: "mock-user-text-2" }],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, contents starting and ending with model (appends AND prepends prompt)", () => {
    const rendered = render({
      prompt: "mock-prompt",
      contents: [
        {
          role: "model",
          parts: [{ text: "mock-model-text" }],
        },
        {
          role: "user",
          parts: [{ text: "mock-user-text" }],
        },
        {
          role: "model",
          parts: [{ text: "mock-model-text-2" }],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, contents starting and ending with user (does not add prompt)", () => {
    const rendered = render({
      prompt: "mock-prompt-should-not-appear",
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-user-text" }],
        },
        {
          role: "model",
          parts: [{ text: "mock-model-text" }],
        },
        {
          role: "user",
          parts: [{ text: "mock-user-text-2" }],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, system_instruction", () => {
    const rendered = render({
      prompt: "mock-prompt",
      system_instruction: {
        parts: [{ text: "mock-system-text" }],
      },
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, contents, system_instruction", () => {
    const rendered = render({
      prompt: "mock-prompt",
      contents: [
        {
          role: "model",
          parts: [{ text: "mock-model-text" }],
        },
        {
          role: "user",
          parts: [{ text: "mock-user-text" }],
        },
      ],
      system_instruction: {
        parts: [{ text: "mock-system-text" }],
      },
    });
    expect(rendered).toMatchSnapshot();
  });

  /**
   * Combinations of FewShotRequestOptions and "native" options:
   */

  test("prompt, examplePairs, contents with user / model (appends prompt)", () => {
    const rendered = render({
      prompt: "mock-prompt",
      examplePairs: [
        {
          user: "mock-user-example-pair",
          assistant: "mock-assistant-example-pair",
        },
      ],
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-user-text" }],
        },
        {
          role: "model",
          parts: [{ text: "mock-model-text" }],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, examplePairs, contents with model / user (inserts prompt, conversation is valid)", () => {
    const rendered = render({
      prompt: "mock-prompt",
      examplePairs: [
        {
          user: "mock-user-example-pair",
          assistant: "mock-assistant-example-pair",
        },
      ],
      contents: [
        {
          role: "model",
          parts: [{ text: "mock-model-text" }],
        },
        {
          role: "user",
          parts: [{ text: "mock-user-text" }],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, examplePairs, system_instruction", () => {
    const rendered = render({
      prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
      ],
      system_instruction: {
        parts: [{ text: "mock-system-text" }],
      },
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, system, contents", () => {
    const rendered = render({
      prompt: "mock-prompt",
      system: "mock-system-text",
      contents: [
        {
          role: "model",
          parts: [{ text: "mock-model-text" }],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, system, system_instruction", () => {
    const rendered = render({
      prompt: "mock-prompt",
      system: "mock-system-text",
      system_instruction: {
        parts: [
          { text: "mock-additional-instruction" },
          { text: "mock-additional-instruction-2" },
        ],
      },
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, examplePairs, contents, system_instruction", () => {
    const rendered = render({
      prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
      ],
      contents: [
        {
          role: "model",
          parts: [{ text: "mock-model-text" }],
        },
      ],
      system_instruction: {
        parts: [{ text: "mock-system-text" }],
      },
    });
    expect(rendered).toMatchSnapshot();
  });

  /**
   * Tool-related:
   */

  test("prompt, contents ending with function_call, $tools with matching invocation (appends function_response content items)", () => {
    const rendered = render({
      prompt: "mock-prompt",
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-user-text" }],
        },
        {
          role: "model",
          parts: [
            {
              functionCall: {
                name: "mock-function",
                args: { key: "value" },
              },
            },
          ],
        },
      ],
      $tools: [
        {
          name: "mock-function",
          description: "mock-description",
          parameters: [
            {
              name: "key",
              description: "mock-key-description",
              type: "STR",
              required: true,
            },
          ],
          invocations: [
            {
              arguments: { key: "value" },
              resolved: true,
              returned: { responseKey: "responseValue" },
            },
          ],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, contents ending with model function_call, $tools without matching invocation (appends prompt; TODO logs warning)", () => {
    const rendered = render({
      prompt: "mock-prompt",
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-user-text" }],
        },
        {
          role: "model",
          parts: [
            {
              functionCall: {
                name: "mock-function",
                args: { key: "value" },
              },
            },
          ],
        },
      ],
      $tools: [
        {
          name: "another-function",
          description: "another-description",
          parameters: [
            {
              name: "another-key",
              description: "another-key-description",
              type: "STR",
              required: false,
            },
          ],
          invocations: [],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
    // TODO expect warning
  });

  test("prompt, contents ending with model function_call, no $tools (prepends and appends prompt; TODO logs warning)", () => {
    const rendered = render({
      prompt: "mock-prompt",
      contents: [
        {
          role: "model",
          parts: [
            {
              functionCall: {
                name: "mock-function",
                args: { key: "value" },
              },
            },
          ],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
    // TODO expect warning
  });

  test("prompt, contents ending with user function_response (prepends prompt)", () => {
    const rendered = render({
      prompt: "mock-prompt",
      contents: [
        {
          role: "model",
          parts: [
            {
              functionCall: {
                name: "mock-function",
                args: { key: "value" },
              },
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              function_response: {
                name: "mock-function",
                response: { responseKey: "responseValue" },
              },
            },
          ],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });
  /*
   *  Tool declarations:
   */
  test("prompt, tools", () => {
    const rendered = render({
      prompt: "mock-prompt",
      tools: [
        {
          function_declarations: [
            {
              name: "mock-function",
              description: "mock-description",
              parameters: {
                type: "OBJECT",
                properties: {
                  key: { type: "STRING" },
                },
              },
            },
          ],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, $tools", () => {
    const rendered = render({
      prompt: "mock-prompt",
      $tools: [
        {
          name: "mock-function-1",
          description: "mock-description-1",
          parameters: [
            {
              name: "mock-function-1-param-1",
              description: "mock-function-1-param-1-description-1",
              type: "STR",
              required: false,
            },
            {
              name: "mock-function-1-param-2",
              description: "mock-function-1-param-2-description-2",
              type: "NUM",
              required: false,
            },
          ],
          invocations: [],
        },
        {
          name: "mock-function-2",
          description: "mock-description-2",
          parameters: [
            {
              name: "mock-function-2-param-1",
              description: "mock-function-2-param-1-description-1",
              type: "BOOL",
              required: false,
            },
          ],
          invocations: [],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, tools, $tools", () => {
    const rendered = render({
      prompt: "mock-prompt",
      tools: [
        {
          function_declarations: [
            {
              name: "mock-function",
              description: "mock-description",
              parameters: {
                type: "OBJECT",
                properties: {
                  key: { type: "STRING" },
                },
              },
            },
          ],
        },
      ],
      $tools: [
        {
          name: "mock-function-1",
          description: "mock-description-1",
          parameters: [
            {
              name: "mock-function-1-param-1",
              description: "mock-function-1-param-1-description-1",
              type: "STR",
              required: false,
            },
            {
              name: "mock-function-1-param-2",
              description: "mock-function-1-param-2-description-2",
              type: "NUM",
              required: true,
            },
          ],
          invocations: [],
        },
        {
          name: "mock-function-2",
          description: "mock-description-2",
          parameters: [
            {
              name: "mock-function-2-param-1",
              description: "mock-function-2-param-1-description-1",
              type: "BOOL",
              required: false,
            },
          ],
          invocations: [],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, tools_config", () => {
    const rendered = render({
      prompt: "mock-prompt",
      tools_config: {
        mode: "AUTO",
        allowed_function_names: ["mock-function"],
      },
    });
    expect(rendered).toMatchSnapshot();
  });

  /**
   * "Native" options:
   */
  test("prompt, safety_settings", () => {
    const rendered = render({
      prompt: "mock-prompt",
      safety_settings: {
        category: "mock-category",
        threshold: "mock-threshold",
      },
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, generation_config", () => {
    const rendered = render({
      prompt: "mock-prompt",
      generation_config: {
        temperature: 0.7,
        top_p: 0.9,
      },
    });
    expect(rendered).toMatchSnapshot();
  });

  test("prompt, tool, tools_config, system_instruction, safety_settings, generation_config", () => {
    const rendered = render({
      prompt: "mock-prompt",
      contents: [
        {
          role: "model",
          parts: [{ text: "mock-model-text" }],
        },
      ],
      tools: [
        {
          function_declarations: [
            {
              name: "mock-function",
            },
          ],
        },
      ],
      tools_config: {
        mode: "ANY",
      },
      system_instruction: {
        parts: [{ text: "mock-system-text" }],
      },
      safety_settings: {
        threshold: "mock-threshold",
        method: "mock-method",
      },
      generation_config: {
        top_p: 0.7,
        max_output_tokens: 100,
      },
    });
    expect(rendered).toMatchSnapshot();
  });
});
