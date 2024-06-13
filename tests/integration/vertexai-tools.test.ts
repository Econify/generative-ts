import { createVertexAiModelProvider } from "@packages/google-vertex-ai";

test("VertexAI - Google Gemini (Tools)", async () => {
  // arrange
  const model = await createVertexAiModelProvider({
    modelId: "gemini-1.0-pro",
  });

  // act
  const response = await model.sendRequest({
    system: "Use tools to help answer questions.",
    prompt: "What is the weather in Boston and New York City?",
    tools: [
      {
        function_declarations: [
          {
            name: "get_current_weather",
            description: "Get the current weather for a given location",
            parameters: {
              type: "OBJECT",
              properties: {
                city: {
                  type: "STRING",
                  description: "The city, e.g. San Francisco",
                },
                state: {
                  type: "STRING",
                  description: "The state, e.g. CA",
                },
              },
              required: ["city", "state"],
            },
          },
        ],
      },
    ],
  });

  // console.log(JSON.stringify(response.data.candidates, null, 2));

  // assert
  expect(response).toMatchApiSnapshot();
});

test("VertexAI - Google Gemini (Tools with Responses)", async () => {
  // arrange
  const model = await createVertexAiModelProvider({
    modelId: "gemini-1.0-pro",
  });

  // act
  const response = await model.sendRequest({
    system: "Use tools to help answer questions.",
    prompt: "",
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
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "What is the weather in Boston and New York City?",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            function_call: {
              name: "get_current_weather",
              args: {
                city: "Boston",
                state: "MA",
              },
            },
          },
          {
            function_call: {
              name: "get_current_weather",
              args: {
                city: "New York City",
                state: "NY",
              },
            },
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            function_response: {
              name: "get_current_weather",
              response: {
                temperature: "70",
                temperature_unit: "F",
                pressure: "30.1",
                pressure_unit: "inHg",
                humidity: "50",
                condition: "Sunny",
              },
            },
          },
          {
            function_response: {
              name: "get_current_weather",
              response: {
                temperature: "22",
                temperature_unit: "F",
                pressure: "50.2",
                pressure_unit: "inHg",
                humidity: "55",
                condition: "Hurricanes",
              },
            },
          },
        ],
      },
    ],
    tools: [
      {
        function_declarations: [
          {
            name: "get_current_weather",
            description: "Get the current weather for a given location",
            parameters: {
              type: "OBJECT",
              properties: {
                city: {
                  type: "STRING",
                  description: "The city, e.g. San Francisco",
                },
                state: {
                  type: "STRING",
                  description: "The state, e.g. CA",
                },
              },
              required: ["city", "state"],
            },
          },
        ],
      },
    ],
  });

  // console.log(JSON.stringify(response.data.candidates, null, 2));

  // assert
  expect(response).toMatchApiSnapshot();
});
