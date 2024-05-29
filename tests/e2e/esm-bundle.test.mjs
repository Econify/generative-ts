import * as core from '../../packages/core/dist/index.mjs';
import * as generativeTs from '../../packages/generative-ts/dist/index.mjs';

const modelFromCore = core.createLmStudioModelProvider({
  modelId: "lmstudio-community/Meta-Llama-3-70B-Instruct-GGUF/Meta-Llama-3-70B-Instruct-IQ1_M.gguf",
})

const modelFromMain = generativeTs.createLmStudioModelProvider({
  modelId: "lmstudio-community/Meta-Llama-3-70B-Instruct-GGUF/Meta-Llama-3-70B-Instruct-IQ1_M.gguf",
})

const sayload = {
  prompt: "Brief History of NY Mets:",
  system: "talk like jafar from aladdin",
  examplePairs: [],
  messages: [],
  temperature: 1.0
};

modelFromCore.sendRequest(sayload).then((response) => {
  console.log(response.choices[0].message);
});

modelFromMain.sendRequest(sayload).then((response) => {
  console.log(response.choices[0].message);
});
