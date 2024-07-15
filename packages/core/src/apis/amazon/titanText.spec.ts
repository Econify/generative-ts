import { AmazonTitanTextApi, AmazonTitanTextOptions } from "./titanText";

function render(context: Omit<AmazonTitanTextOptions, "modelId">) {
  try {
    const rendered = AmazonTitanTextApi.requestTemplate.render({
      modelId: "mock-model-id",
      ...context,
    });
    return JSON.parse(rendered);
  } catch (error) {
    throw new Error("Invalid JSON output");
  }
}

describe("AmazonTitanTextApi:", () => {
  /**
   * FewShotRequestOptions (prompt):
   */
  test("$prompt", () => {
    const rendered = render({
      $prompt: "mock-prompt",
    });

    expect(rendered).toMatchSnapshot();
  });

  /**
   * All options:
   */
  test("all options", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      temperature: 0.7,
      topP: 0.9,
      maxTokenCount: 100,
      stopSequences: ["mock-stop-1", "mock-stop-2"],
    });

    expect(rendered).toMatchSnapshot();
  });
});
