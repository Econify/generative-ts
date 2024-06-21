import { createOpenAiChatModelProvider } from "@packages/core";

test("OpenAI - OpenAI ChatCompletion", async () => {
  // arrange
  const gpt4 = createOpenAiChatModelProvider({
    modelId: "gpt-4-turbo",
  });

  // act
  const response = await gpt4.sendRequest({
    $prompt: "Brief History of NY Mets:",
    max_tokens: 100,
  });

  // assert
  expect(response).toMatchApiSnapshot();
});
