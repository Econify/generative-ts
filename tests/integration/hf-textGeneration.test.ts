import {
  createHuggingfaceInferenceModelProvider,
  HfTextGenerationTaskApi,
} from "@packages/core";

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
