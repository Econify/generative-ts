import { createAwsBedrockModelProvider, Llama3ChatApi } from "@packages/core";

test("Bedrock - Llama3 Chat", async () => {
  // arrange
  const llama3 = createAwsBedrockModelProvider({
    api: Llama3ChatApi,
    modelId: "meta.llama3-8b-instruct-v1:0",
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
  const response = await llama3.sendRequest(payload);

  // assert
  expect(response).toMatchApiSnapshot();
});
