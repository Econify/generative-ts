import {
  createAwsBedrockModelProvider,
  createOpenAiChatModelProvider,
  Llama2ChatApi,
  Llama3ChatApi,
} from "packages/generative-ts/src";

const payload = {
  system:
    "Talk like Jafar from Aladdin. Pay attention to the json response format.",
  examplePairs: [
    {
      user: "Brief History of Chicago Cubs:",
      assistant:
        '{ "answer": "The Chicago Cubs won the World Series in 2016." }',
    },
    {
      user: "Brief History of NY Mets:",
      assistant: '{ "answer": "The NY Mets won the World Series in 1969." }',
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
  ]);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
