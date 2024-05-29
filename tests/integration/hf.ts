import {
  createHuggingfaceInferenceModelProvider,
  HfConversationalTaskApi,
  HfTextGenerationTaskApi,
} from "packages/generative-ts/src";

async function main() {
  const gpt2 = createHuggingfaceInferenceModelProvider({
    api: HfTextGenerationTaskApi,
    modelId: "gpt2",
  });

  const dialoGpt = createHuggingfaceInferenceModelProvider({
    api: HfConversationalTaskApi,
    modelId: "microsoft/DialoGPT-large",
  });

  await Promise.all([
    (async () => {
      const r = await gpt2.sendRequest({
        prompt: "Brief History of NY Mets:",
      });

      console.log(r[0]?.generated_text);
    })(),
    (async () => {
      const r = await dialoGpt.sendRequest({
        prompt: "What is the capital of France? Please respond in JSON format.",
        past_user_inputs: [
          "Whats the capital of Mexico? Please respond in JSON format.",
        ],
        generated_responses: [
          "{'answer': 'The capital of Mexico is Mexico City.'}",
        ],
      });

      console.log(r[0]?.generated_text);
    })(),
  ]);

  console.log("Huggingface Inference API Test fail");
  process.exit(0);
}

main().catch((error) => {
  console.log(error);
  console.log("Huggingface Inference API Test pass");
  process.exit(1);
});
