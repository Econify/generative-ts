/* eslint-disable import/no-relative-packages */

import { createVertexAiModelProvider } from "@packages/gcloud-vertex-ai";

// TODO decide on these import/exports as part of public API
import { mapGeminiResponseToToolInvocations } from "../../packages/core/src/apis/google/mapGeminiResponseToToolInvocations";
import { Tool } from "../../packages/core/src/utils/Tool";

test("VertexAI - Google Gemini (Tools)", async () => {
  // arrange
  const model = await createVertexAiModelProvider({
    modelId: "gemini-1.0-pro",
  });

  // act
  const response = await model.sendRequest({
    system: "Use tools to help answer questions.",
    $prompt: "What is the weather in Boston and New York City?",
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
    $prompt: "",
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
            functionCall: {
              name: "get_current_weather",
              args: {
                city: "Boston",
                state: "MA",
              },
            },
          },
          {
            functionCall: {
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

test("VertexAI - Google Gemini ($tools workflow)", async () => {
  // arrange
  const model = await createVertexAiModelProvider({
    modelId: "gemini-1.0-pro",
  });

  const system =
    "Use tools to help answer questions. Keep in mind that you can make multiple tool calls.";

  const $prompt = "What is the weather in Boston and New York City?";

  const $tools = [
    new Tool(
      "get_current_weather",
      "Get the current weather for a given location",
      {
        city: {
          description: "The city name",
          type: "STR",
          required: true,
        },
        state: {
          description: "The state name",
          type: "STR",
          required: true,
        },
        zipcode: {
          description: "An optional zipcode",
          type: "NUM",
          required: false,
        },
      },
      ({ city, state, zipcode }) => {
        console.log("Invoking get_current_weather tool...", {
          city,
          state,
          zipcode,
        });
        const randomTemp = Math.random();
        return {
          temperature: `${randomTemp}F`,
        };
      },
    ),
  ];

  // act
  const response = await model.sendRequest({
    system,
    $prompt,
    $tools,
  });

  mapGeminiResponseToToolInvocations(response, $tools); // TODO internal

  // console.log(JSON.stringify(response, null, 2));
  // console.log(JSON.stringify(tools, null, 2));

  const allResolved = $tools.every((tool) => tool.allResolved());

  if (!allResolved) {
    await Promise.all($tools.map((tool) => tool.resolveAll()));
  }

  // TODO something like: const contents = getConversationHistory(model);
  const last = response.data.candidates[0]?.content;

  if (!last) {
    throw new Error("No content found in response!?");
  }

  const response2 = await model.sendRequest({
    system,
    $prompt,
    contents: [
      {
        role: last.role as "user" | "model", // TODO fix typing disparity between req and resp
        parts: last.parts,
      },
    ],
    $tools,
  });

  // console.log(JSON.stringify(response2.data.candidates[0]?.content, null, 2));

  const allResolved2 = $tools.every((tool) => tool.allResolved());

  // assert
  expect(allResolved2).toBe(true);
  expect(response2).toMatchApiSnapshot();
});
