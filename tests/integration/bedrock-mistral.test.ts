import {
  createAwsBedrockModelProvider,
  MistralBedrockApi,
} from "@packages/core";

test("Bedrock - Mistral (Bedrock specific)", async () => {
  // arrange
  const mistral = createAwsBedrockModelProvider({
    api: MistralBedrockApi,
    modelId: "mistral.mistral-7b-instruct-v0:2",
  });

  const payload = {
    system: `
      Talk like Jafar from Aladdin.
      Pay attention to the json response format! Your answer must be exact, parsable JSON as specified
      Dont just give the world series year, give some history about the team as well.`,
    examplePairs: [
      {
        user: "Brief History of Chicago Cubs:",
        assistant:
          '{ "answer": "The Chicago Cubs won the World Series in 2016." }',
      },
      {
        user: "Brief History of LA Dodgers:",
        assistant:
          '{ "answer": "The LA Dodgers won the World Series in 2020." }',
      },
    ],
    prompt: "Brief History of NY Mets:",
  };

  // act
  const response = await mistral.sendRequest(payload);

  // assert
  expect(response).toMatchApiSnapshot();
});
