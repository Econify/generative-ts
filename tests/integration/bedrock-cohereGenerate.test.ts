import {
  CohereGenerateApi,
  createAwsBedrockModelProvider,
} from "@packages/core";

test("Bedrock - Cohere Generate", async () => {
  // arrange
  const cohereGenerate = createAwsBedrockModelProvider({
    api: CohereGenerateApi,
    modelId: "cohere.command-text-v14",
  });

  // act
  const response = await cohereGenerate.sendRequest({
    prompt: "Brief history of NY Mets:",
    max_tokens: 100,
  });

  // assert
  expect(response).toMatchApiSnapshot();
});
