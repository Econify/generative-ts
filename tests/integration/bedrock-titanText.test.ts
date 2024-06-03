import {
  AmazonTitanTextApi,
  createAwsBedrockModelProvider,
} from "@packages/core";

test("Bedrock - Amazon TitanText", async () => {
  // arrange
  const titanText = createAwsBedrockModelProvider({
    api: AmazonTitanTextApi,
    modelId: "amazon.titan-text-express-v1",
  });

  // act
  const response = await titanText.sendRequest({
    prompt: "Brief history of NY Mets:",
    maxTokenCount: 100,
  });

  // assert
  expect(response).toMatchApiSnapshot();
});
