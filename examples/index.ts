import {
  Ai21Jurassic2Api,
  AmazonTitanTextApi,
  CohereGenerateApi,
  createAwsBedrockModelProvider,
  createCohereLegacyModelProvider,
  createGroqModelProvider,
  createHuggingfaceTextGenerationModelProvider,
  createLmStudioModelProvider,
  createOpenAiChatModelProvider,
  Llama3ChatApi,
  MistralBedrockApi,
} from "packages/generative-ts/src";

async function main() {
  const prompt = "Brief History of NY Mets:";

  const gptProvider = createOpenAiChatModelProvider({
    modelId: "gpt-4-turbo",
  });

  const titanTextProvider = createAwsBedrockModelProvider({
    api: AmazonTitanTextApi,
    modelId: "amazon.titan-text-express-v1",
  });

  const cohereCommandProvider = createAwsBedrockModelProvider({
    api: CohereGenerateApi,
    modelId: "cohere.command-text-v14",
  });

  const llama3aws = createAwsBedrockModelProvider({
    api: Llama3ChatApi,
    modelId: "meta.llama3-8b-instruct-v1:0",
  });

  const mistral = createAwsBedrockModelProvider({
    api: MistralBedrockApi,
    modelId: "mistral.mistral-7b-instruct-v0:2",
  });

  const jurassic = createAwsBedrockModelProvider({
    api: Ai21Jurassic2Api,
    modelId: "ai21.j2-mid-v1",
  });

  const huggingfaceProvider2 = createHuggingfaceTextGenerationModelProvider({
    modelId: "gpt2",
  });

  const lmStudioProvider = createLmStudioModelProvider({
    modelId: "lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF",
    // endpoint: "http://localhost:1234/v1/chat/completions",
  });

  const groqProvider = createGroqModelProvider({
    modelId: "llama3-70b-8192",
  });

  const cohereProvider = createCohereLegacyModelProvider({
    modelId: "command",
  });

  const queries = [
    {
      name: "GPT-4-Turbo(OpenAI)",
      provider: gptProvider,
      params: {
        system: "talk like jafar from aladdin",
        prompt,
        max_tokens: 50,
        temperature: 1.0,
      },
    },
    {
      name: "Titan(AWS)",
      provider: titanTextProvider,
      params: { prompt, maxTokenCount: 50, temperature: 1.0 },
    },
    {
      name: "Cohere-Command(AWS)",
      provider: cohereCommandProvider,
      params: { prompt, max_tokens: 50, temperature: 1.0 },
    },
    {
      name: "GPT2(HF)",
      provider: huggingfaceProvider2,
      params: { prompt, parameters: { max_new_tokens: 50, temperature: 1.0 } },
    },
    {
      name: "LLama3(LM Studio)",
      provider: lmStudioProvider,
      params: {
        prompt,
        system: "talk like iago from aladdin",
        temperature: 1.0,
        max_tokens: 50,
      },
    },
    {
      name: "Llama3(Bedrock)",
      provider: llama3aws,
      params: {
        prompt,
        system: "talk like jafar from aladdin",
        temperature: 1.0,
      },
    },
    {
      name: "Jurassic2(AWS)",
      provider: jurassic,
      params: { prompt, maxTokens: 50, temperature: 1.0 },
    },
    {
      name: "Mistral(AWS)",
      provider: mistral,
      params: { prompt, temperature: 1.0 },
    },
    {
      name: "Lama3-70b(Groq)",
      provider: groqProvider,
      params: {
        prompt,
        system: "talk like jafar from aladdin",
        temperature: 1.0,
      },
    },
    {
      name: "Cohere-Command(Cohere-API)",
      provider: cohereProvider,
      params: { prompt },
    },
  ];

  const results = await Promise.all(
    queries.map(async (query) => {
      try {
        const response = await query.provider.sendRequest(query.params);
        return { name: query.name, status: "Success", response };
      } catch (error) {
        return { name: query.name, status: "Failed", error };
      }
    }),
  );

  console.log("Results:\n=====");
  results.forEach((result) => {
    console.log(`[${result.status}] ${result.name}`);
  });
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
