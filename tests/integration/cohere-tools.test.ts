import { CohereChatApi, createCohereModelProvider } from "@packages/core";

test("Cohere - Chat (Tools)", async () => {
  // arrange
  const cohereChat = createCohereModelProvider({
    api: CohereChatApi,
    modelId: "command-r-plus",
  });

  // act
  // const response = await cohereChat.sendRequest({
  //   prompt: "Will the NY Mets game be a rainout tonight",
  //   preamble: "Answer like Jafar from Aladdin",
  //   tools: [
  //     {
  //       name: "get_weather",
  //       description: "tells you the weather in a certain city",
  //       parameter_definitions: {
  //         city: {
  //           type: "str",
  //           description: "the city you want the weather for",
  //         },
  //       },
  //     },
  //   ],
  // });

  // get back a chat_history that looks like this:
  /*
      "chat_history": [
        {
          "role": "USER",
          "message": "Will the NY Mets game be a rainout tonight"
        },
        {
          "role": "CHATBOT",
          "tool_calls": [
            {
              "name": "get_weather",
              "parameters": {
                "city": "New York City"
              }
            }
          ]
        }
      ],
  */

  const response = await cohereChat.sendRequest({
    prompt: "Will the NY Mets game be a rainout tonight",
    preamble: "Answer like Jafar from Aladdin",
    system: "Use the correct JSON output format",
    examplePairs: [
      {
        user: "Heres an example question demonstrating desired JSON format",
        assistant: "{ _correct_answer: 'Im jafar and here is your answer' }",
      },
    ],
    chat_history: [
      {
        role: "USER",
        message: "Will the NY Mets game be a rainout tonight",
      },
      {
        role: "CHATBOT",
        tool_calls: [
          {
            name: "get_weather",
            parameters: {
              city: "New York City",
            },
          },
        ],
      },
      {
        role: "TOOL",
        tool_results: [
          {
            call: {
              name: "get_weather",
              parameters: {
                city: "New York City",
              },
            },
            outputs: [
              {
                weather: "300 feet of rain expected. evacuate immediately.",
              },
            ],
          },
        ],
      },
    ],
    tool_results: [
      {
        call: {
          name: "get_weather",
          parameters: {
            city: "New York City",
          },
        },
        outputs: [
          {
            weather: "300 feet of rain expected. evacuate immediately.",
          },
        ],
      },
    ],
    tools: [
      {
        name: "get_weather",
        description: "tells you the weather in a certain city",
        parameter_definitions: {
          city: {
            type: "str",
            description: "the city you want the weather for",
          },
        },
      },
    ],
  });

  console.log(JSON.stringify(response.chat_history, null, 2));
  console.log(`Text: "${response.text}"`);

  // assert
  // expect(response).toMatchApiSnapshot();
  expect(response).toBeDefined();
});
