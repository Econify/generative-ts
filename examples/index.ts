import { createAwsBedrockModelProvider } from "../src/providers/aws_bedrock";
import { createHuggingfaceTextGenerationModelProvider } from "../src/providers/huggingface_inference";
import { createOpenAiChatModelProvider } from "../src/providers/openai";
import { createGroqModelProvider } from "../src/providers/groq";
import { createLmStudioModelProvider } from "../src/providers/lm_studio";
import { createCohereLegacyModelProvider } from "../src/providers/cohere";

// import { createHttpModelProvider } from "./providers/http";
// import { BearerTokenAuthStrategy } from "./providers/http/strategies";

import { AmazonTitanTextApi } from "../src/apis/amazon_titan_text";
import { CohereGenerateApi } from "../src/apis/cohere";
import { Llama3ChatApi } from "../src/apis/meta";
import { MistralApi } from "../src/apis/mistral";
import { Ai21Jurassic2Api } from "../src/apis/ai21_jurassic2";

async function handleRequest<T>(
  promise: Promise<T>,
  description: string,
  extractResponse: (response: T) => string | undefined,
): Promise<void> {
  try {
    const response = await promise;
    const formattedResponse = extractResponse(response);
    console.log(`\n${description}:\n=====\n${formattedResponse}\n=====`);
  } catch (error) {
    console.error(`Error in ${description}:`, error);
  }
}

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
    api: MistralApi,
    modelId: "mistral.mistral-7b-instruct-v0:2",
  });

  const jurassic = createAwsBedrockModelProvider({
    api: Ai21Jurassic2Api,
    modelId: "ai21.j2-mid-v1",
  });

  const huggingfaceProvider = createHuggingfaceTextGenerationModelProvider({
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

  const requests = [
    handleRequest(
      gptProvider.sendRequest({
        prompt,
        system: "talk like jafar from aladdin",
        max_tokens: 50,
        temperature: 1.0,
      }),
      "GPT-4-Turbo(OpenAI)",
      (response) => response.choices[0]?.message.content,
    ),

    handleRequest(
      titanTextProvider.sendRequest({
        prompt,
        maxTokenCount: 50,
        temperature: 1.0,
      }),
      "Titan(AWS)",
      (response) => response.results[0]?.outputText,
    ),

    handleRequest(
      cohereCommandProvider.sendRequest({
        prompt,
        max_tokens: 50,
        temperature: 1.0,
      }),
      "Cohere-Command(AWS)",
      (response) => response.generations[0]?.text,
    ),

    handleRequest(
      huggingfaceProvider.sendRequest({
        prompt,
        parameters: {
          max_new_tokens: 50,
          temperature: 1.0,
        },
      }),
      "GPT2(HF)",
      (response) => response[0]?.generated_text,
    ),

    handleRequest(
      lmStudioProvider.sendRequest({
        prompt,
        system: "talk like iago from aladdin",
        temperature: 1.0,
        max_tokens: 50,
      }),
      "LLama3(LM Studio)",
      (response) => response.choices[0]?.message.content,
    ),

    handleRequest(
      llama3aws.sendRequest({
        prompt,
        system: "talk like jafar from aladdin",
        temperature: 1.0,
      }),
      "Llama3(Bedrock)",
      (response) => response.generation,
    ),

    handleRequest(
      jurassic.sendRequest({
        prompt,
        maxTokens: 50,
        temperature: 1.0,
      }),
      "Jurassic2(AWS)",
      (response) => response.completions[0]?.data.text,
    ),

    handleRequest(
      mistral.sendRequest({
        prompt,
        temperature: 1.0,
      }),
      "Mistral(AWS)",
      (response) => response.outputs[0]?.text,
    ),

    handleRequest(
      groqProvider.sendRequest({
        prompt,
        system: "talk like jafar from aladdin",
        temperature: 1.0,
      }),
      "Lama3-70b(Groq)",
      (response) => response.choices[0]?.message.content,
    ),

    handleRequest(
      cohereProvider.sendRequest({
        prompt,
      }),
      "Cohere-Command(Cohere-API)",
      (response) => response.generations[0]?.text,
    ),
  ];

  await Promise.all(requests);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
