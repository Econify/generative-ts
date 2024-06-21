import { MistralAiApi, MistralAiOptions } from "./mistralAiApi";

function render(context: Omit<MistralAiOptions, "modelId">) {
  try {
    const rendered = MistralAiApi.requestTemplate.render({
      modelId: "mock-model-id",
      ...context,
    });
    return JSON.parse(rendered);
  } catch (error) {
    throw new Error("Invalid JSON output");
  }
}

describe("MistralAiApi:", () => {
  /**
   * FewShotRequestOptions ($prompt, examplePairs, system):
   */

  test("$prompt", () => {
    const rendered = render({
      $prompt: "mock-prompt",
    });

    expect(rendered).toMatchSnapshot();

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
        },
      ],
      system: "mock-system-text",
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 1000,
      stream: true,
      safe_prompt: true,
      random_seed: 1234,
    });

    expect(rendered).toMatchSnapshot();
  });
});
