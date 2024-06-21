import { createMistralModelProvider } from "@packages/core";

test("Mistral - Mistral AI ChatCompletion", async () => {
  // arrange
  const mistralLarge = createMistralModelProvider({
    modelId: "mistral-large-latest",
  });

  // act
  const response = await mistralLarge.sendRequest({
    $prompt: "Brief History of NY Mets:",
    max_tokens: 100,
  });

  // assert
  expect(response).toMatchApiSnapshot();
});
