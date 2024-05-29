import {
  createAwsBedrockModelProvider,
  Llama2ChatApi,
  Llama3ChatApi,
  MistralBedrockApi,
} from "packages/generative-ts/src";

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

  await Promise.all([
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

  console.log("AWS Bedrock Test pass");
  process.exit(0);
}

main().catch((error) => {
  console.log(error);
  console.log("AWS Bedrock Test fail");
  process.exit(1);
});
