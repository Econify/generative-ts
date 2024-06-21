import { OpenAiChatApi, OpenAiChatOptions } from "./openAiChatApi";

function render(context: Omit<OpenAiChatOptions, "modelId">) {
  try {
    const rendered = OpenAiChatApi.requestTemplate.render({
      modelId: "mock-model-id",
      ...context,
    });
    return JSON.parse(rendered);
  } catch (error) {
    throw new Error("Invalid JSON output");
  }
}

describe("OpenAiChatApi:", () => {
  /**
   * FewShotRequestOptions (prompt, examplePairs, system):
   */

  test("$prompt", () => {
    const rendered = render({
      $prompt: "mock-prompt",
    });

    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, examplePairs", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
        { user: "mock-user-msg-2", assistant: "mock-assistant-msg-2" },
      ],
    });

    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, system", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      system: "mock-system-text",
    });

    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, examplePairs, system", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
      ],
      system: "mock-system-text",
    });

    expect(rendered).toMatchSnapshot();
  });

  /**
   * "Native" few shot options (messages):
   */

  test("$prompt, messages", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      messages: [
        {
          role: "assistant",
          content: "mock-assistant-text",
        },
        {
          role: "user",
          content: "mock-user-text",
        },
        {
          role: "assistant",
          content: "mock-assistant-text-2",
        },
      ],
    });

    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, examplePairs, messages", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
      ],
      messages: [
        {
          role: "assistant",
          content: "mock-assistant-text",
        },
      ],
    });

    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, system, messages", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      system: "mock-system-text",
      messages: [
        {
          role: "assistant",
          content: "mock-assistant-text",
        },
        {
          role: "user",
          content: "mock-user-text",
        },
        {
          role: "assistant",
          content: "mock-assistant-text-2",
        },
      ],
    });

    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, examplePairs, system, messages", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
      ],
      system: "mock-system-text",
      messages: [
        {
          role: "assistant",
          content: "mock-assistant-text",
        },
      ],
    });

    expect(rendered).toMatchSnapshot();
  });

  /**
   * Tool-related:
   */

  test("$prompt, messages with function_call", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      messages: [
        {
          role: "assistant",
          content: "mock-assistant-text",
          function_call: {
            name: "mock-function",
            arguments: '{ "key": "value" }',
          },
        },
      ],
    });

    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, tools", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      tools: [
        {
          type: "function",
          function: {
            name: "mock-function",
            description: "mock-description",
            parameters: {
              type: "object",
              properties: {
                key: { type: "string" },
              },
            },
          },
        },
      ],
    });

    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, tool_choice", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      tool_choice: {
        type: "function",
        function: {
          name: "mock-function",
        },
      },
    });

    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, functions", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      functions: [
        {
          name: "mock-function",
          description: "mock-description",
          parameters: {
            type: "object",
            properties: {
              key: { type: "string" },
            },
          },
        },
      ],
    });

    expect(rendered).toMatchSnapshot();
  });

  /**
   * All options:
   */

  test("all options", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
      ],
      messages: [
        {
          role: "assistant",
          content: "mock-assistant-text",
          function_call: {
            name: "mock-function",
            arguments: '{ "key": "value" }',
          },
        },
      ],
      system: "mock-system-text",
      frequency_penalty: 0.5,
      logit_bias: {
        "50256": -100,
      },
      logprobs: true,
      top_logprobs: 5,
      max_tokens: 1000,
      n: 3,
      presence_penalty: 0.3,
      response_format: {
        type: "json_object",
      },
      seed: 1234,
      stop: ["mock-stop"],
      stream: true,
      stream_options: {
        include_usage: true,
      },
      temperature: 0.7,
      top_p: 0.9,
      user: "mock-user",
      tools: [
        {
          type: "function",
          function: {
            name: "mock-tool-function",
            description: "mock-description",
            parameters: {
              type: "object",
              properties: {
                key: { type: "string" },
              },
            },
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: {
          name: "mock-tool-choice-function",
        },
      },
      function_call: "auto",
      functions: [
        {
          name: "mock-function",
          description: "mock-description",
          parameters: {
            type: "object",
            properties: {
              key: { type: "string" },
            },
          },
        },
      ],
    });

    expect(rendered).toMatchSnapshot();
  });
});
