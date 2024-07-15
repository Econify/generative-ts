import { CohereGenerateApi, CohereGenerateOptions } from "./generate";

function render(context: Omit<CohereGenerateOptions, "modelId">) {
  try {
    const rendered = CohereGenerateApi.requestTemplate.render({
      modelId: "mock-model-id",
      ...context,
    });
    return JSON.parse(rendered);
  } catch (error) {
    throw new Error("Invalid JSON output");
  }
}

describe("CohereGenerateApi:", () => {
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
      num_generations: 3,
      max_tokens: 1000,
      truncate: "END",
      temperature: 0.7,
      seed: 1234,
      end_sequences: ["mock-end-seq"],
      stop_sequences: ["mock-stop-seq"],
      k: 5,
      p: 0.9,
      frequency_penalty: 0.5,
      presence_penalty: 0.3,
      return_likelihoods: "ALL",
      logit_bias: { 50256: -100 },
    });

    expect(rendered).toMatchSnapshot();
  });

  /**
   * Special cases:
   */

  test("$prompt, stop_sequences and end_sequences", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      stop_sequences: ["mock-stop-seq"],
      end_sequences: ["mock-end-seq"],
    });

    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, truncate as NONE", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      truncate: "NONE",
    });

    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, return_likelihoods as NONE", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      return_likelihoods: "NONE",
    });

    expect(rendered).toMatchSnapshot();
  });

  test("$prompt, logit_bias with multiple values", () => {
    const rendered = render({
      $prompt: "mock-prompt",
      logit_bias: { 50256: -100, 50257: 50 },
    });

    expect(rendered).toMatchSnapshot();
  });
});
