import { createCohereLegacyModelProvider } from "@packages/core";

test("Cohere - Generate", async () => {
  // arrange
  const cohere = createCohereLegacyModelProvider({
    modelId: "text-1.0.0",
  });

  // act
  const response = await cohere.sendRequest({
    prompt: "Brief History of NY Mets:",
  });

  // assert
  expect(response).toMatchApiSnapshot();
});
