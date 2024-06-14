import {
  HfConversationalTaskApi,
  HfConversationalTaskOptions,
} from "./hfConversationTaskApi";

function render(context: Omit<HfConversationalTaskOptions, "modelId">) {
  try {
    const rendered = HfConversationalTaskApi.requestTemplate.render({
      modelId: "mock-model-id",
      ...context,
    });
    return JSON.parse(rendered);
  } catch (error) {
    throw new Error("Invalid JSON output");
  }
}

describe("HfConversationalTaskOptions:", () => {
  test("prompt", () => {
    const rendered = render({
      prompt: "mock-prompt",
    });

    expect(rendered).toMatchSnapshot();
  });

  test("prompt, past_user_inputs", () => {
    const rendered = render({
      prompt: "mock-prompt",
      past_user_inputs: ["input1", "input2"],
    });

    expect(rendered).toMatchSnapshot();
  });

  test("prompt, generated_responses", () => {
    const rendered = render({
      prompt: "mock-prompt",
      generated_responses: ["response1", "response2"],
    });

    expect(rendered).toMatchSnapshot();
  });

  test("prompt, past_user_inputs, generated_responses", () => {
    const rendered = render({
      prompt: "mock-prompt",
      past_user_inputs: ["input1", "input2"],
      generated_responses: ["response1", "response2"],
    });

    expect(rendered).toMatchSnapshot();
  });

  test("prompt, parameters", () => {
    const rendered = render({
      prompt: "mock-prompt",
      parameters: {
        min_length: 10,
        max_length: 100,
        top_k: 50,
        top_p: 0.9,
        temperature: 0.7,
        repetition_penalty: 1.2,
        max_time: 60,
      },
    });

    expect(rendered).toMatchSnapshot();
  });

  test("prompt, options", () => {
    const rendered = render({
      prompt: "mock-prompt",
      options: {
        use_cache: true,
        wait_for_model: false,
      },
    });

    expect(rendered).toMatchSnapshot();
  });

  test("all options", () => {
    const rendered = render({
      prompt: "mock-prompt",
      past_user_inputs: ["input1", "input2"],
      generated_responses: ["response1", "response2"],
      parameters: {
        min_length: 10,
        max_length: 100,
        top_k: 50,
        top_p: 0.9,
        temperature: 0.7,
        repetition_penalty: 1.2,
        max_time: 60,
      },
      options: {
        use_cache: true,
        wait_for_model: false,
      },
    });

    expect(rendered).toMatchSnapshot();
  });
});
