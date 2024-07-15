import { CohereChatApi, CohereChatOptions } from "./chat";

function render(context: Omit<CohereChatOptions, "modelId">) {
  try {
    const rendered = CohereChatApi.requestTemplate.render({
      modelId: "mock-model-id",
      ...context,
    });
    return JSON.parse(rendered);
  } catch (error) {
    throw new Error("Invalid JSON output");
  }
}

describe("CohereChatApi:", () => {
  /**
   * FewShotRequestOptions (prompt, examplePairs, system):
   */
  test("$prompt", () => {
    const rendered = render({ $prompt: "mock-prompt" });
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

  test("$prompt, examplePairs, chat_history", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
      ],
      chat_history: [
        { role: "USER", message: "mock-user-msg" },
        { role: "CHATBOT", message: "mock-chatbot-msg" },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  /**
   * Native few shot options (chat_history):
   */
  test("$prompt, chat_history", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      chat_history: [
        { role: "USER", message: "mock-user-msg" },
        { role: "CHATBOT", message: "mock-chatbot-msg" },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, examplePairs, chat_history", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
      ],
      chat_history: [{ role: "CHATBOT", message: "mock-chatbot-msg" }],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, system, chat_history", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      system: "mock-system-text",
      chat_history: [
        { role: "USER", message: "mock-user-msg" },
        { role: "CHATBOT", message: "mock-chatbot-msg" },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, examplePairs, system, chat_history", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
      ],
      system: "mock-system-text",
      chat_history: [{ role: "CHATBOT", message: "mock-chatbot-msg" }],
    });
    expect(rendered).toMatchSnapshot();
  });

  /**
   * Tool-related:
   */
  test("$prompt, tools", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      tools: [
        {
          name: "mock-tool",
          description: "mock-description",
          parameter_definitions: {
            param1: {
              type: "string",
              description: "mock-param-desc",
              required: true,
            },
          },
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, tool_results", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      tool_results: [
        {
          call: {
            name: "mock-tool",
            parameters: { key: "value" },
          },
          outputs: [{ key: "output-value" }],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, chat_history with tool_calls", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      chat_history: [
        {
          role: "USER",
          tool_calls: [{ name: "mock-tool", parameters: { key: "value" } }],
          message: "mock-user-msg",
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
      chat_history: [
        { role: "USER", message: "mock-user-msg" },
        {
          role: "CHATBOT",
          tool_calls: [{ name: "mock-tool", parameters: { key: "value" } }],
        },
        {
          role: "TOOL",
          tool_results: [
            {
              call: { name: "mock-tool", parameters: { key: "value" } },
              outputs: [{ key: "output-value" }],
            },
          ],
        },
      ],
      system: "mock-system-text",
      stream: true,
      preamble: "mock-preamble",
      conversation_id: "mock-conversation-id",
      prompt_truncation: "mock-prompt-truncation",
      search_queries_only: true,
      documents: [{ key: "doc-value" }],
      citation_quality: "high",
      temperature: 0.7,
      max_tokens: 1000,
      max_input_tokens: 1500,
      k: 10,
      p: 0.9,
      seed: 1234,
      stop_sequences: ["mock-stop"],
      frequency_penalty: 0.5,
      presence_penalty: 0.3,
      tools: [
        {
          name: "mock-tool",
          description: "mock-description",
          parameter_definitions: {
            param1: {
              type: "string",
              description: "mock-param-desc",
              required: true,
            },
          },
        },
      ],
      tool_results: [
        {
          call: {
            name: "mock-tool",
            parameters: { key: "value" },
          },
          outputs: [{ key: "output-value" }],
        },
      ],
      force_single_step: true,
    });
    expect(rendered).toMatchSnapshot();
  });

  /**
   * Special Logic:
   */
  test("combination of system and preamble", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      system: "mock-system-text",
      preamble: "mock-preamble",
    });
    expect(rendered).toMatchSnapshot();
  });

  test("optional message in CohereChatHistoryToolCall", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      chat_history: [
        {
          role: "CHATBOT",
          tool_calls: [{ name: "mock-tool", parameters: { key: "value" } }],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("optional message in CohereChatHistoryToolResults", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      chat_history: [
        {
          role: "TOOL",
          tool_results: [
            {
              call: { name: "mock-tool", parameters: { key: "value" } },
              outputs: [{ key: "output-value" }],
            },
          ],
        },
      ],
    });
    expect(rendered).toMatchSnapshot();
  });

  test("undefined examplePairs and chat_history", () => {
    const rendered = render({ $prompt: "mock-prompt" });
    expect(rendered).toMatchSnapshot();
  });
});
