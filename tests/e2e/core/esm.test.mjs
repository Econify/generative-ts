import * as esm from "../../../packages/core/dist/index.mjs";

describe('@generative-ts/core esm bundle', () => {
  test('api snapshot', async () => {
    expect(esm).toMatchSnapshot();
  });

  test('sanity check', async () => {
    const model = esm.createLmStudioModelProvider({
      modelId: "TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
    });
    
    const response = await model.sendRequest({
      prompt: "Say hi:",
      max_tokens: 50,
      temperature: 0
    });

    expect(response.choices[0].message).toBeDefined();
  });
});
