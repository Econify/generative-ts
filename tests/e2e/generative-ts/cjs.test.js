const cjs = require("../../../packages/generative-ts/dist/index.cjs");

describe('generative-ts cjs bundle', () => {
  test('api snapshot', async () => {
    expect(cjs).toMatchSnapshot();
  });

  test('sanity check', async () => {
    const model = cjs.createLmStudioModelProvider({
      modelId: "TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
    });
    
    const response = await model.sendRequest({
      $prompt: "Say hi:",
      generation_config: {
        max_output_tokens: 50,
        temperature: 0
      }
    });

    expect(response.choices[0].message).toBeDefined();
  });
});
