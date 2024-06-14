import {
  HfTextGenerationTaskApi,
  HfTextGenerationTaskOptions,
} from "./hfTextGenerationApi";

function render(context: Omit<HfTextGenerationTaskOptions, "modelId">) {
  try {
    const rendered = HfTextGenerationTaskApi.requestTemplate.render({
      modelId: "mock-model-id",
      ...context,
    });
    return JSON.parse(rendered);
  } catch (error) {
    throw new Error("Invalid JSON output");
  }
}

describe("HfInferenceApi:", () => {
  test("prompt only", () => {
    const rendered = render({
      prompt: "mock-prompt",
    });

    expect(rendered).toMatchSnapshot();
  });

  test("prompt and parameters", () => {
    const rendered = render({
      prompt: "mock-prompt",
      parameters: {
        top_k: 50,
        top_p: 0.9,
        temperature: 0.7,
        repetition_penalty: 1.2,
        max_new_tokens: 100,
        max_time: 60,
        return_full_text: true,
        num_return_sequences: 3,
        do_sample: true,
      },
    });

    expect(rendered).toMatchSnapshot();
  });

  test("prompt and options", () => {
    const rendered = render({
      prompt: "mock-prompt",
      options: {
        use_cache: true,
        wait_for_model: false,
      },
    });

    expect(rendered).toMatchSnapshot();
  });

  test("prompt, parameters, and options", () => {
    const rendered = render({
      prompt: "mock-prompt",
      parameters: {
        top_k: 50,
        top_p: 0.9,
        temperature: 0.7,
        repetition_penalty: 1.2,
        max_new_tokens: 100,
        max_time: 60,
        return_full_text: true,
        num_return_sequences: 3,
        do_sample: true,
      },
      options: {
        use_cache: true,
        wait_for_model: false,
      },
    });

    expect(rendered).toMatchSnapshot();
  });

  test("empty parameters", () => {
    const rendered = render({
      prompt: "mock-prompt",
      parameters: {},
    });

    expect(rendered).toMatchSnapshot();
  });

  test("empty options", () => {
    const rendered = render({
      prompt: "mock-prompt",
      options: {},
    });

    expect(rendered).toMatchSnapshot();
  });

  test("all options", () => {
    const rendered = render({
      prompt: "mock-prompt",
      parameters: {
        top_k: 50,
        top_p: 0.9,
        temperature: 0.7,
        repetition_penalty: 1.2,
        max_new_tokens: 100,
        max_time: 60,
        return_full_text: true,
        num_return_sequences: 3,
        do_sample: true,
      },
      options: {
        use_cache: true,
        wait_for_model: false,
      },
    });

    expect(rendered).toMatchSnapshot();
  });
});
