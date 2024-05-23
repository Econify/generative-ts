const core = require('../packages/core/dist/index.cjs');
const generativeTs = require('../packages/generative-ts/dist/index.cjs');

const modelFromCore = core.createLmStudioModelProvider({
  modelId: "lmstudio-community/Meta-Llama-3-70B-Instruct-GGUF/Meta-Llama-3-70B-Instruct-IQ1_M.gguf",
})

const modelFromMain = generativeTs.createLmStudioModelProvider({
  modelId: "lmstudio-community/Meta-Llama-3-70B-Instruct-GGUF/Meta-Llama-3-70B-Instruct-IQ1_M.gguf",
})

modelFromCore.sendRequest({ prompt: "hi" }).then((response) => {
  console.log(response.choices[0].message);
});

modelFromMain.sendRequest({ prompt: "hi" }).then((response) => {
  console.log(response.choices[0].message);
});
