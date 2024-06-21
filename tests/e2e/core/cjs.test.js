const cjs = require("../../../packages/core/dist/index.cjs");

describe('@generative-ts/core cjs bundle', () => {
  test('api snapshot', async () => {
    expect(cjs).toMatchSnapshot();
  });

  test('sanity check', async () => {
    const model = cjs.createLmStudioModelProvider({
      modelId: "TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
    });
    
    const response = await model.sendRequest({
      $prompt: "Say hi:",
      max_tokens: 50,
      temperature: 0
    });

    expect(response.choices[0].message).toBeDefined();
  });
});
