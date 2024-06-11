import { createVertexAiModelProvider } from "@packages/google-vertex-ai";

test("VertexAI - OpenAI ChatCompletion", async () => {
  // arrange
  const model = createVertexAiModelProvider({
    modelId: "TODO",
  });

  // act
  const response = await model.sendRequest({
    prompt: "Brief History of NY Mets:",
    max_tokens: 100,
  });

  // assert
  expect(response).toMatchApiSnapshot();
});
