const core = require('../../packages/core/dist/index.cjs');
const generativeTs = require('../../packages/generative-ts/dist/index.cjs');
const vertexAi = require('../../packages/gcloud-vertex-ai/dist/index.cjs');

async function main() {
  const modelFromCore = core.createLmStudioModelProvider({
    modelId: "TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
  })
  
  const modelFromMain = generativeTs.createLmStudioModelProvider({
    modelId: "TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
  })
  
  const vertex = await vertexAi.createVertexAiModelProvider({
    modelId: "gemini-1.0-pro",
    auth: {
      GCLOUD_LOCATION: 'us-central1',
      GCLOUD_PROJECT_ID: 'jmn-testing'
    }
  })
  
  const sayload = {
    prompt: "Brief History of NY Mets:",
    system: "talk like jafar from aladdin",
    max_tokens: 50,
    temperature: 1.0
  };
  
  modelFromCore.sendRequest(sayload).then((response) => {
    console.log(response.choices[0].message);
  });
  
  modelFromMain.sendRequest(sayload).then((response) => {
    console.log(response.choices[0].message);
  });
  
  vertex.sendRequest(sayload).then((response) => {
    console.log(response.data.candidates);
  });
}

void main();