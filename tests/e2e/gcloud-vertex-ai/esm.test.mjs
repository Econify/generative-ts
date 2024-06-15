import * as esm from "../../../packages/gcloud-vertex-ai/dist/index.mjs";

describe('@generative-ts/gcloud-vertex-ai esm bundle', () => {
  test('api snapshot', async () => {
    expect(esm).toMatchSnapshot();
  });

  test('sanity check', async () => {
    const model = await esm.createVertexAiModelProvider({
      modelId: "gemini-1.0-pro",
      auth: {
        GCLOUD_LOCATION: 'us-central1',
        GCLOUD_PROJECT_ID: 'jmn-testing'
      }
    });

    const response = await model.sendRequest({
      prompt: "Say hi:",
      max_tokens: 50,
      temperature: 0
    });

    expect(response.data.candidates).toBeDefined();
  });
});
