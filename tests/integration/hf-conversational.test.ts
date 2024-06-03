import {
  createHuggingfaceInferenceModelProvider,
  HfConversationalTaskApi,
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
