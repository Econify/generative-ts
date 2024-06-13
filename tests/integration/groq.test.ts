import { createGroqModelProvider } from "@packages/core";

test("Groq - OpenAI ChatCompletion", async () => {
  // arrange
  const groq = createGroqModelProvider({
    modelId: "llama3-70b-8192",
  });

  // act
  const response = await groq.sendRequest(
    {
      prompt: "Brief History of NY Mets:",
      max_tokens: 100,
    },
    {
      timeout: 123123,
    },
  );

  // assert
  expect(response).toMatchApiSnapshot();
});
