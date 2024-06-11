import {
  CohereChatApi,
  CohereGenerateApi,
  createCohereModelProvider,
} from "@packages/core";

test("Cohere - Generate", async () => {
  // arrange
  const cohereGen = createCohereModelProvider({
    api: CohereGenerateApi,
    modelId: "command",
  });

  // act
  const response = await cohereGen.sendRequest({
    prompt: "Brief History of NY Mets:",
    return_likelihoods: "ALL",
  });

  // assert
  expect(response).toMatchApiSnapshot();
});

test("Cohere - Chat", async () => {
  // arrange
  const cohereChat = createCohereModelProvider({
    api: CohereChatApi,
    modelId: "command-r-plus",
  });

  // act
  const response = await cohereChat.sendRequest({
    prompt: "Brief History of NY Mets:",
    preamble: "Talk like Jafar from Aladdin",
  });

  // assert
  expect(response).toMatchApiSnapshot();
});

test("Cohere - Chat (Default)", async () => {
  // arrange
  const cohereChat = createCohereModelProvider({
    modelId: "command-r-plus",
  });

  // act
  const response = await cohereChat.sendRequest({
    prompt: "Brief History of NY Mets:",
    preamble: "Talk like Jafar from Aladdin",
  });

  // assert
  expect(response).toMatchApiSnapshot();
});
