import { GoogleGeminiApi, GoogleGeminiOptions } from "./gemini";

function render(context: unknown) {
  try {
    const rendered = GoogleGeminiApi.requestTemplate.render(
      context as GoogleGeminiOptions,
    );
    return JSON.parse(rendered);
  } catch (error) {
    throw new Error("Invalid JSON output");
  }
}

describe("GoogleGeminiApi.requestTemplate", () => {
  test("prompt", () => {
    const rendered = render({
      prompt: "mock-prompt",
    });

    expect(rendered).toEqual({
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
        },
      ],
    });
  });

  test("prompt, system", () => {
    const rendered = render({
      prompt: "mock-prompt",
      system: "mock-system-text",
    });

    expect(rendered).toEqual({
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
        },
      ],
      system_instruction: {
        parts: [
          {
            text: "mock-system-text",
          },
        ],
      },
    });
  });

  test("prompt, system_instruction", () => {
    const rendered = render({
      prompt: "mock-prompt",
      system_instruction: {
        parts: [{ text: "mock-system-text" }],
      },
    });

    expect(rendered).toEqual({
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
        },
      ],
      system_instruction: {
        parts: [{ text: "mock-system-text" }],
      },
    });
  });

  test("prompt, system and system_instruction", () => {
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

    expect(rendered).toEqual({
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
        },
      ],
      system_instruction: {
        parts: [
          {
            text: "mock-system-text",
          },
          {
            text: "mock-additional-instruction",
          },
          {
            text: "mock-additional-instruction-2",
          },
        ],
      },
    });
  });

  test("prompt, examplePairs", () => {
    const rendered = render({
      prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
        { user: "mock-user-msg-2", assistant: "mock-assistant-msg-2" },
      ],
    });

    expect(rendered).toEqual({
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-user-msg-1" }],
        },
        {
          role: "model",
          parts: [{ text: "mock-assistant-msg-1" }],
        },
        {
          role: "user",
          parts: [{ text: "mock-user-msg-2" }],
        },
        {
          role: "model",
          parts: [{ text: "mock-assistant-msg-2" }],
        },
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
        },
      ],
    });
  });

  test("prompt, contents", () => {
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

    expect(rendered).toEqual({
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
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
        },
      ],
    });
  });

  test("prompt, examplePairs, contents", () => {
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
    });

    expect(rendered).toEqual({
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-user-msg-1" }],
        },
        {
          role: "model",
          parts: [{ text: "mock-assistant-msg-1" }],
        },
        {
          role: "model",
          parts: [{ text: "mock-model-text" }],
        },
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
        },
      ],
    });
  });

  test("doesnt include prompt if contents end with a user role", () => {
    const rendered = render({
      prompt: "mock-prompt",
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-user-text" }],
        },
      ],
    });

    expect(rendered).toEqual({
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-user-text" }],
        },
      ],
    });
  });

  test("prompt, contents with function_call", () => {
    const rendered = render({
      prompt: "mock-prompt",
      contents: [
        {
          parts: [
            {
              function_call: {
                name: "mock-function",
                args: { key: "value" },
              },
            },
          ],
        },
      ],
    });

    expect(rendered).toEqual({
      contents: [
        {
          parts: [
            {
              function_call: {
                name: "mock-function",
                args: { key: "value" },
              },
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
        },
      ],
    });
  });

  test("prompt, contents with function_response", () => {
    const rendered = render({
      prompt: "mock-prompt",
      contents: [
        {
          parts: [
            {
              function_response: {
                name: "mock-function",
                response: { key: "value" },
              },
            },
          ],
        },
      ],
    });

    expect(rendered).toEqual({
      contents: [
        {
          parts: [
            {
              function_response: {
                name: "mock-function",
                response: { key: "value" },
              },
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
        },
      ],
    });
  });

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

    expect(rendered).toEqual({
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
        },
      ],
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
  });

  test("prompt, tools_config", () => {
    const rendered = render({
      prompt: "mock-prompt",
      tools_config: {
        mode: "AUTO",
        allowed_function_names: ["mock-function"],
      },
    });

    expect(rendered).toEqual({
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
        },
      ],
      tools_config: {
        mode: "AUTO",
        allowed_function_names: ["mock-function"],
      },
    });
  });

  test("prompt, safety_settings", () => {
    const rendered = render({
      prompt: "mock-prompt",
      safety_settings: {
        category: "mock-category",
        threshold: "mock-threshold",
      },
    });

    expect(rendered).toEqual({
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
        },
      ],
      safety_settings: {
        category: "mock-category",
        threshold: "mock-threshold",
      },
    });
  });

  test("prompt, generation_config", () => {
    const rendered = render({
      prompt: "mock-prompt",
      generation_config: {
        temperature: 0.7,
        top_p: 0.9,
      },
    });

    expect(rendered).toEqual({
      contents: [
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
        },
      ],
      generation_config: {
        temperature: 0.7,
        top_p: 0.9,
      },
    });
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

    expect(rendered).toEqual({
      contents: [
        {
          role: "model",
          parts: [{ text: "mock-model-text" }],
        },
        {
          role: "user",
          parts: [{ text: "mock-prompt" }],
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
  });
});
