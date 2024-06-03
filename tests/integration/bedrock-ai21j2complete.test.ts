import {
  Ai21Jurassic2Api,
  createAwsBedrockModelProvider,
} from "@packages/core";

test("Bedrock - AI21 J2 Complete", async () => {
  // arrange
  const j2 = createAwsBedrockModelProvider({
    api: Ai21Jurassic2Api,
    modelId: "ai21.j2-mid-v1",
  });

  // act
  const response = await j2.sendRequest({
    prompt: "Brief history of NY Mets:",
    numResults: 1,
    maxTokens: 50,
    minTokens: 0,
    temperature: 0.5,
    topP: 1,
    topKReturn: 1,
    stopSequences: ["."],
  });

  // assert
  expect(response).toMatchApiSnapshot();
});
