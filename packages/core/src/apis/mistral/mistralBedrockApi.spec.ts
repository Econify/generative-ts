import { MistralBedrockApi, MistralBedrockOptions } from "./mistralBedrockApi";

function render(context: Omit<MistralBedrockOptions, "modelId">) {
  try {
    const rendered = MistralBedrockApi.requestTemplate.render({
      modelId: "mock-model-id",
      ...context,
    });
    return JSON.parse(rendered);
  } catch (error) {
    throw new Error("Invalid JSON output");
  }
}

describe("MistralBedrockApi:", () => {
  /**
   * FewShotRequestOptions ($prompt, examplePairs, system):
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
        { user: "mock-user-msg-2", assistant: "mock-assistant-msg-2" },
      ],
      system: "mock-system-text",
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
      system: "mock-system-text",
      max_tokens: 1000,
      stop: ["mock-stop-1"],
      temperature: 0.7,
      top_p: 0.9,
      top_k: 50,
    });

    expect(rendered).toMatchSnapshot();
  });
});
