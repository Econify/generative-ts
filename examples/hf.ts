import {
  createHuggingfaceInferenceModelProvider,
  HfConversationalTaskApi,
} from "packages/generative-ts/src";

async function main() {
  const prov = createHuggingfaceInferenceModelProvider({
    api: HfConversationalTaskApi,
    modelId: "microsoft/DialoGPT-large",
  });

  const result = await prov.sendRequest({
    prompt: "What is the capital of France? Please respond in JSON format.",
    past_user_inputs: [
      "Whats the capital of Mexico? Please respond in JSON format.",
    ],
    generated_responses: [
      "{'answer': 'The capital of Mexico is Mexico City.'}",
    ],
  });

  console.log(result);
}

main()
  .then(() => console.log("done"))
  .catch(console.error);
