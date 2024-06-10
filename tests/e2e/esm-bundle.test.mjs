import * as core from '../../packages/core/dist/index.mjs';
import * as generativeTs from '../../packages/generative-ts/dist/index.mjs';

const modelFromCore = core.createLmStudioModelProvider({
  modelId: "TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
})

const modelFromMain = generativeTs.createLmStudioModelProvider({
  modelId: "TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
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
