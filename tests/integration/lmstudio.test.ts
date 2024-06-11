import { createLmStudioModelProvider } from "@packages/core";

test("LmStudio - OpenAI ChatCompletion", async () => {
  // arrange
  const lmStudio = createLmStudioModelProvider({
    modelId: "lmstudio-community/Meta-Llama-3-70B-Instruct-GGUF",
  });

  // act
  const response = await lmStudio.sendRequest({
    prompt: "Brief History of NY Mets:",
    max_tokens: 100,
  });

  // assert
  expect(response).toMatchApiSnapshot();
});
