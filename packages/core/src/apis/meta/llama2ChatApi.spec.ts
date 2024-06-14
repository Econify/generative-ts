import { Llama2ChatApi, Llama2ChatOptions } from "./llama2ChatApi";

function render(context: Omit<Llama2ChatOptions, "modelId">) {
  try {
    const rendered = Llama2ChatApi.requestTemplate.render({
      modelId: "mock-model-id",
      ...context,
    });
    return JSON.parse(rendered);
  } catch (error) {
    throw new Error("Invalid JSON output");
  }
}

describe("Llama2ChatApi:", () => {
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
   * All options:
   */

  test("all options", () => {
    const rendered = render({
      prompt: "mock-prompt",
      examplePairs: [
        { user: "mock-user-msg-1", assistant: "mock-assistant-msg-1" },
        { user: "mock-user-msg-2", assistant: "mock-assistant-msg-2" },
        { user: "mock-user-msg-3", assistant: "mock-assistant-msg-3" },
      ],
      system: "mock-system-text",
      temperature: 0.7,
      top_p: 0.9,
      max_gen_len: 1500,
    });

    expect(rendered).toMatchSnapshot();
  });
});
