import { createAwsBedrockModelProvider, Llama2ChatApi } from "@packages/core";

test("Bedrock - Llama2 Chat", async () => {
  // arrange
  const llama2 = createAwsBedrockModelProvider({
    api: Llama2ChatApi,
    modelId: "meta.llama2-13b-chat-v1",
  });

  const payload = {
    system: `
      Talk like Jafar from Aladdin.
      Pay attention to the json response format! Your answer must be exact, parsable JSON as specified
      Dont just give the world series year, give some history about the team as well.`,
    examplePairs: [
      {
        user: "Brief History of Chicago Cubs:",
        assistant: '{ "answer": "The Chicago Cubs won the World Series in 2016." }',
      },
      {
        user: "Brief History of LA Dodgers:",
        assistant: '{ "answer": "The LA Dodgers won the World Series in 2020." }',
      },
    ],
    prompt: "Brief History of NY Mets:",
  };

  // act
  const response = await llama2.sendRequest(payload);

  // assert
  expect(response).toMatchApiSnapshot();
});
