import * as core from '../../packages/core/dist/index.mjs';
import * as generativeTs from '../../packages/generative-ts/dist/index.mjs';
import * as vertexAi from '../../packages/gcloud-vertex-ai/dist/index.mjs';

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
    console.log(response.choices[0].message);
  }).catch((error) => {
    console.log(error);
    console.log('Caught expected error from createVertexAiModelProvider');
  });
}

void main();
