const cjs = require("../../../packages/gcloud-vertex-ai/dist/index.cjs");

describe('@generative-ts/gcloud-vertex-ai cjs bundle', () => {
  test('api snapshot', async () => {
    expect(cjs).toMatchSnapshot();
  });

  test('sanity check', async () => {
    const model = await cjs.createVertexAiModelProvider({
      modelId: "gemini-1.0-pro",
      auth: {
        GCLOUD_LOCATION: 'us-central1',
        GCLOUD_PROJECT_ID: 'jmn-testing'
      }
    });

    const response = await model.sendRequest({
      $prompt: "Say hi:",
      max_tokens: 50,
      temperature: 0
    });

    expect(response.data.candidates).toBeDefined();
  });
});
