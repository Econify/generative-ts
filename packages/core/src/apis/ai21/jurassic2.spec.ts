import { Ai21Jurassic2Api, Ai21Jurassic2Options } from "./jurassic2";

function render(context: Omit<Ai21Jurassic2Options, "modelId">) {
  try {
    const rendered = Ai21Jurassic2Api.requestTemplate.render({
      modelId: "mock-model-id",
      ...context,
    });
    return JSON.parse(rendered);
  } catch (error) {
    throw new Error("Invalid JSON output");
  }
}

describe("Ai21Jurassic2Api:", () => {
  /**
   * FewShotRequestOptions (prompt):
   */

  test("prompt", () => {
    const rendered = render({
      prompt: "mock-prompt",
    });

    expect(rendered).toMatchSnapshot();
  });

  /**
   * All options:
   */

  test("all options", () => {
    const rendered = render({
      prompt: "mock-prompt",
      numResults: 3,
      maxTokens: 200,
      minTokens: 100,
      temperature: 0.7,
      topP: 0.9,
      topKReturn: 5,
      stopSequences: ["mock-stop-1", "mock-stop-2"],
      countPenalty: {
        scale: 0.5,
        applyToWhitespaces: true,
        applyToPunctuations: false,
        applyToNumbers: true,
        applyToStopwords: false,
        applyToEmojis: true,
      },
      presencePenalty: {
        scale: 0.3,
        applyToWhitespaces: false,
        applyToPunctuations: true,
        applyToNumbers: false,
        applyToStopwords: true,
        applyToEmojis: false,
      },
      frequencyPenalty: {
        scale: 0.7,
        applyToWhitespaces: true,
        applyToPunctuations: true,
        applyToNumbers: false,
        applyToStopwords: false,
        applyToEmojis: true,
      },
    });

    expect(rendered).toMatchSnapshot();
  });
});
