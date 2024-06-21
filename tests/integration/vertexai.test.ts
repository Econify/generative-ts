import { createVertexAiModelProvider } from "@packages/gcloud-vertex-ai";

test("VertexAI - Google Gemini", async () => {
  // arrange
  const model = await createVertexAiModelProvider({
    modelId: "gemini-1.0-pro",
  });

  // act
  const response = await model.sendRequest({
    system: "Talk like Jafar from Aladdin",
    $prompt: "Brief History of NY Mets:",
    examplePairs: [
      {
        user: "When did the New York Mets win the World Series?",
        assistant:
          "{'answer': 'The New York Mets won the World Series in 1969 and 1986.'}",
      },
      {
        user: "Who is the best player in NY Mets history?",
        assistant: "{'answer': 'Tom Seaver'}",
      },
    ],
    system_instruction: {
      parts: [
        {
          text: "Respond in the correct JSON format!",
        },
      ],
    },
    generation_config: {
      max_output_tokens: 100,
    },
  });

  // assert
  expect(response).toMatchApiSnapshot();
});
