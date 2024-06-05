import {
  createHuggingfaceInferenceModelProvider,
  HfConversationalTaskApi,
  HfTextGenerationTaskApi,
} from "@packages/core";

test("Huggingface - Conversational Task", async () => {
  // arrange
  const dialoGpt = createHuggingfaceInferenceModelProvider({
    api: HfConversationalTaskApi,
    modelId: "microsoft/DialoGPT-large",
  });

  // act
  const response = await dialoGpt.sendRequest({
    prompt: "What is the capital of France? Please respond in JSON format.",
    past_user_inputs: [
      "Whats the capital of Mexico? Please respond in JSON format.",
    ],
    generated_responses: [
      "{'answer': 'The capital of Mexico is Mexico City.'}",
    ],
  });

  // assert
  expect(response).toMatchApiSnapshot();
});

test("Huggingface - TextGeneration Task", async () => {
  // arrange
  const gpt2 = createHuggingfaceInferenceModelProvider({
    api: HfTextGenerationTaskApi,
    modelId: "gpt2",
  });

  // act
  const response = await gpt2.sendRequest({
    prompt: "Brief History of NY Mets:",
  });

  // assert
  expect(response).toMatchApiSnapshot();
});
