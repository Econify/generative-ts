import * as index from "./index";

describe("index", () => {
  it("exports public API", () => {
    expect(index.createAwsBedrockModelProvider).toBeDefined();
    expect(index.createCohereModelProvider).toBeDefined();
    expect(index.createGroqModelProvider).toBeDefined();
    expect(index.createHuggingfaceInferenceModelProvider).toBeDefined();
    expect(index.createLmStudioModelProvider).toBeDefined();
    expect(index.createMistralModelProvider).toBeDefined();
    expect(index.createOpenAiChatModelProvider).toBeDefined();
    expect(index.createVertexAiModelProvider).toBeDefined();
  });
});
