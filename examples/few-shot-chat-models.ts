import {
  createAwsBedrockModelProvider,
  createOpenAiChatModelProvider,
  Llama2ChatApi,
  Llama3ChatApi,
  MistralBedrockApi,
} from "@packages/core";

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
      assistant: '{ "answer": "The LA Dodgers won the World Series in 2020." }',
    },
  ],
  prompt: "Brief History of NY Mets:",
};

async function main() {
  const gptProvider = createOpenAiChatModelProvider({
    modelId: "gpt-3.5-turbo",
  });

  const llama2 = createAwsBedrockModelProvider({
    api: Llama2ChatApi,
    modelId: "meta.llama2-13b-chat-v1",
  });

  const llama3 = createAwsBedrockModelProvider({
    api: Llama3ChatApi,
    modelId: "meta.llama3-8b-instruct-v1:0",
  });

  const mistral = createAwsBedrockModelProvider({
    api: MistralBedrockApi,
    modelId: "mistral.mistral-7b-instruct-v0:2",
  });

  return Promise.all([
    (async () => {
      const r = await gptProvider.sendRequest(payload);

      console.log("\nGPT3.5 Response:");
      console.log(r.choices[0]?.message.content);
    })(),
    (async () => {
      const r = await llama2.sendRequest(payload);

      console.log("\nLlama2 Response:");
      console.log(r.generation);
    })(),
    (async () => {
      const r = await llama3.sendRequest(payload);

      console.log("\nLlama3 Response:");
      console.log(r.generation);
    })(),
    (async () => {
      const r = await mistral.sendRequest(payload);

      console.log("\nMistral Response:");
      console.log(r.outputs[0]?.text);
    })(),
  ]);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
