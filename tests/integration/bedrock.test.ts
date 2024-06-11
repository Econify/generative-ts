import {
  Ai21Jurassic2Api,
  AmazonTitanTextApi,
  CohereGenerateApi,
  createAwsBedrockModelProvider,
  Llama2ChatApi,
  Llama3ChatApi,
  MistralBedrockApi,
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
  const response = await llama2.sendRequest(payload);

  // assert
  expect(response).toMatchApiSnapshot();
});

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
  const response = await llama3.sendRequest(payload);

  // assert
  expect(response).toMatchApiSnapshot();
});

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
